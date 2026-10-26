import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as notificacionRepository from '../repositories/notificacion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';

import {
  emitirAUsuario,
  notificarNuevoEjercicio,
  notificarEjercicioCorregido,
} from '../socket/socket.server';

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
      tipo: 'EJERCICIO_NUEVO',
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

export interface NotificarEjercicioCorregidoParams {
  alumnoUsuarioId: string;
  ejercicioId: number;
  idEntrega: number;
  tituloEjercicio: string;
  docenteNombre: string;
  fechaCorreccion: Date;
}

/**
 * Persiste la notificación en base de datos para el alumno de una entrega corregida
 * y emite los eventos en tiempo real vía Socket.IO.
 */
export async function notificarEjercicioCorregidoAlumno(
  params: NotificarEjercicioCorregidoParams,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const {
    alumnoUsuarioId,
    ejercicioId,
    idEntrega,
    tituloEjercicio,
    docenteNombre,
    fechaCorreccion,
  } = params;

  const titulo = 'Ejercicio corregido';
  const mensaje = `Tu entrega para "${tituloEjercicio}" ha sido corregida por el docente ${docenteNombre}.`;

  // 1. Persistir notificación en la base de datos
  await notificacionRepository.crearNotificacion(
    {
      usuarioId: alumnoUsuarioId,
      ejercicioId,
      tipo: 'EJERCICIO_CORREGIDO',
      titulo,
      mensaje,
    },
    tx
  );

  // 2. Emitir eventos en tiempo real al alumno vía WebSockets
  try {
    notificarEjercicioCorregido(alumnoUsuarioId, {
      idEjercicio: ejercicioId,
      idEntrega,
      titulo: tituloEjercicio,
      docenteNombre,
      fechaCorreccion,
      mensaje,
    });
  } catch (error) {
    console.warn('[Socket.IO] Error al emitir notificación de ejercicio corregido:', error);
  }
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

export interface ResumenProcesamientoVencimientoDTO {
  ejerciciosEvaluados: number;
  notificacionesEnviadas: number;
  alumnosOmitidosPorEntrega: number;
  alumnosOmitidosPorDuplicado: number;
}

/**
 * Evalúa los ejercicios publicados que vencen en las próximas 24 horas y emite notificaciones
 * de vencimiento próximo a los alumnos que aún no hayan realizado la entrega formal.
 *
 * Es idempotente: no duplica avisos si la notificación ya fue enviada previamente al alumno.
 */
export async function procesarNotificacionesVencimientoProximo(
  fechaReferencia: Date = new Date(),
  tx?: Prisma.TransactionClient
): Promise<ResumenProcesamientoVencimientoDTO> {
  const limiteSuperior = new Date(fechaReferencia.getTime() + 24 * 60 * 60 * 1000);

  const ejercicios = await notificacionRepository.findEjerciciosParaAvisoVencimiento(
    fechaReferencia,
    limiteSuperior,
    tx
  );

  let notificacionesEnviadas = 0;
  let alumnosOmitidosPorEntrega = 0;
  let alumnosOmitidosPorDuplicado = 0;

  for (const ejercicio of ejercicios) {
    const alumnosCurso = ejercicio.curso.alumnos.map((a) => a.id);
    const alumnosEntregados = new Set(ejercicio.entregas.map((e) => e.alumnoId));
    const alumnosYaNotificados = new Set(ejercicio.notificaciones.map((n) => n.usuarioId));

    const alumnosANotificar: string[] = [];

    for (const alumnoId of alumnosCurso) {
      if (alumnosEntregados.has(alumnoId)) {
        alumnosOmitidosPorEntrega++;
        continue;
      }
      if (alumnosYaNotificados.has(alumnoId)) {
        alumnosOmitidosPorDuplicado++;
        continue;
      }
      alumnosANotificar.push(alumnoId);
    }

    if (alumnosANotificar.length === 0) {
      continue;
    }

    const titulo = 'Fecha límite próxima';
    const mensaje = `El ejercicio "${ejercicio.titulo}" vence en menos de 24 horas. Recordá completar tus plantillas y realizar la entrega.`;

    const dataNotificaciones: notificacionRepository.CrearNotificacionData[] =
      alumnosANotificar.map((usuarioId) => ({
        usuarioId,
        ejercicioId: ejercicio.idEjercicio,
        tipo: 'VENCIMIENTO_PROXIMO',
        titulo,
        mensaje,
      }));

    await notificacionRepository.crearNotificacionesMasivas(dataNotificaciones, tx);
    notificacionesEnviadas += alumnosANotificar.length;

    // Emisión en tiempo real vía Socket.IO a cada alumno conectado
    const ahora = new Date();
    for (const usuarioId of alumnosANotificar) {
      emitirAUsuario(usuarioId, 'notificacion:nueva', {
        tipo: 'VENCIMIENTO_PROXIMO',
        titulo,
        mensaje,
        data: {
          idEjercicio: ejercicio.idEjercicio,
          titulo: ejercicio.titulo,
          fechaLimite: ejercicio.fechaLimite,
        },
        createdAt: ahora,
      });
    }
  }

  return {
    ejerciciosEvaluados: ejercicios.length,
    notificacionesEnviadas,
    alumnosOmitidosPorEntrega,
    alumnosOmitidosPorDuplicado,
  };
}
