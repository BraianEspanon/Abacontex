import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as notificacionRepository from '../repositories/notificacion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';

import { notificarNuevoEjercicio } from '../socket/socket.server';

import { ObtenerNotificacionesQueryDTO } from '../validators/notificacion.validator';
import {
  ListadoNotificacionesResponseDTO,
  ContadorNotificacionesResponseDTO,
  NotificacionItemDTO,
  MarcarTodasLeidasResponseDTO,
} from '../dto/notificacion/notificacion.dto';
import { toNotificacionItemDTO } from '../dto/notificacion/notificacion.mapper';

import { ForbiddenError } from '../errors/forbidden.error';

export interface NotificarNuevoEjercicioParams {
  cursoId: number;
  ejercicioId: number;
  tituloEjercicio: string;
  docenteNombre: string;
  fechaLimite: Date;
  createdAt: Date;
}

/**
 * Persiste las notificaciones en base de datos para todos los alumnos del curso
 * y emite el evento en tiempo real vía Socket.IO.
 */
export async function notificarNuevoEjercicioAlumnos(
  params: NotificarNuevoEjercicioParams,
  tx?: Prisma.TransactionClient
): Promise<void> {
  console.log('Entrado al service');
  const { cursoId, ejercicioId, tituloEjercicio, docenteNombre, fechaLimite, createdAt } = params;

  // 1. Obtener los IDs de los alumnos asociados al curso
  const alumnoIds = await alumnoRepository.findUserIdsByCursoId(cursoId, tx);

  if (alumnoIds.length === 0) {
    return;
  }

  const titulo = 'Nuevo Ejercicio Publicado';
  const mensaje = `El docente ${docenteNombre} ha publicado un nuevo ejercicio: "${tituloEjercicio}"`;

  // 2. Preparar datos y persistir notificaciones masivas en PostgreSQL
  const notificacionesData: notificacionRepository.CrearNotificacionData[] = alumnoIds.map(
    (usuarioId) => ({
      usuarioId,
      ejercicioId,
      titulo,
      mensaje,
    })
  );

  await notificacionRepository.crearNotificacionesMasivas(notificacionesData, tx);

  // 3. Emitir evento en tiempo real a la sala del curso vía WebSockets
  notificarNuevoEjercicio({
    idEjercicio: ejercicioId,
    titulo: tituloEjercicio,
    cursoId,
    docenteNombre,
    fechaLimite,
    mensaje,
    createdAt,
  });
}

/**
 * Obtiene el listado paginado de notificaciones del usuario autenticado.
 */
export async function obtenerNotificaciones(
  user: AuthUser,
  query: ObtenerNotificacionesQueryDTO
): Promise<ListadoNotificacionesResponseDTO> {
  // 1. Obtener usuario autenticado en base de datos
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar notificaciones paginadas y total de registros en paralelo
  const [notificaciones, totalItems] = await Promise.all([
    notificacionRepository.findNotificacionesByUsuario(usuario.id, query),
    notificacionRepository.countNotificacionesByUsuario(usuario.id, query.estado),
  ]);

  // 3. Calcular total de páginas
  const totalPages = Math.ceil(totalItems / query.pageSize);

  // 4. Retornar formato de paginación plano
  return {
    items: notificaciones.map(toNotificacionItemDTO),
    page: query.page,
    pageSize: query.pageSize,
    totalItems,
    totalPages,
  };
}

/**
 * Obtiene la cantidad de notificaciones no leídas del usuario autenticado.
 */
export async function obtenerContadorNoLeidas(
  user: AuthUser
): Promise<ContadorNotificacionesResponseDTO> {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);
  const noLeidas = await notificacionRepository.countNotificacionesNoLeidas(usuario.id);

  return { noLeidas };
}

/**
 * Marca una notificación específica como leída para el usuario autenticado.
 */
export async function marcarNotificacionComoLeida(
  user: AuthUser,
  idNotificacion: number
): Promise<NotificacionItemDTO> {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  const notificacion = await notificacionRepository.findNotificacionByIdOrThrow(idNotificacion);

  if (notificacion.usuarioId !== usuario.id) {
    throw new ForbiddenError('No tienes permisos para acceder a esta notificación.');
  }

  if (notificacion.leida) {
    return toNotificacionItemDTO(notificacion);
  }

  const notificacionActualizada =
    await notificacionRepository.marcarNotificacionComoLeida(idNotificacion);

  return toNotificacionItemDTO(notificacionActualizada);
}

/**
 * Marca todas las notificaciones no leídas como leídas para el usuario autenticado.
 */
export async function marcarTodasComoLeidas(user: AuthUser): Promise<MarcarTodasLeidasResponseDTO> {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  const actualizadas = await notificacionRepository.marcarTodasComoLeidasByUsuario(usuario.id);

  return { actualizadas };
}
