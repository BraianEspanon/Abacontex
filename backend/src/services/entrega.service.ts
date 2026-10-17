import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import * as alumnoService from './alumno.service';

import * as entregaRepository from '../repositories/entrega.repository';

import {
  GuardarPlantillaAlumnoBodyDTO,
  ObtenerEntregasAlumnoQueryDTO,
} from '../validators/entrega.validator';

import { OPCIONES_FILTRO_ESTADO_ENTREGA } from '../constants/entrega.constants';

import { NotFoundError } from '../errors/not-found.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { ConflictError } from '../errors/conflict.error';

import {
  DetalleEjercicioAlumnoResponseDTO,
  GuardarPlantillaAlumnoResponseDTO,
  ListadoEntregasAlumnoResponseDTO,
  OpcionesFiltrosEntregaResponseDTO,
  ResolucionAlumnoResponseDTO,
  ResumenTableroEntregasDTO,
} from '../dto/entrega/entrega.dto';

import {
  toDetalleEjercicioAlumnoResponse,
  toGuardarPlantillaAlumnoResponse,
  toItemTableroEntrega,
  toListadoEntregasResponse,
  toResolucionAlumnoResponse,
} from '../dto/entrega/entrega.mapper';

export async function obtenerEntregasAlumno(
  user: AuthUser,
  query: ObtenerEntregasAlumnoQueryDTO
): Promise<ListadoEntregasAlumnoResponseDTO> {
  // 1. Obtener alumno autenticado y validar curso
  const { alumno } = await alumnoService.getAlumnoConCursoOrThrow(user);

  const { idCurso, id: alumnoId } = alumno;

  // 2. Consultar ejercicios publicados del curso
  const ejercicios = await entregaRepository.findEjerciciosParaTableroAlumno(idCurso, alumnoId, {
    busqueda: query.busqueda,
    docenteId: query.docenteId,
  });

  // 3. Mapear y calcular estados dinámicos por ejercicio
  const ahora = new Date();
  const todosLosItems = ejercicios.map((ej) => toItemTableroEntrega(ej, ahora));

  // 4. Calcular métricas de resumen para las cards del tablero
  const resumen: ResumenTableroEntregasDTO = {
    total: todosLosItems.length,
    pendientes: todosLosItems.filter((i) => i.estado === 'PENDIENTE').length,
    enProgreso: todosLosItems.filter((i) => i.estado === 'EN_PROGRESO').length,
    entregados: todosLosItems.filter((i) => i.estado === 'ENTREGADO').length,
    corregidos: todosLosItems.filter((i) => i.estado === 'CORREGIDO').length,
    vencidos: todosLosItems.filter((i) => i.estado === 'VENCIDO').length,
  };

  // 5. Filtrar por estado si se especificó y no es 'TODAS'
  const itemsFiltrados =
    query.estado && query.estado !== 'TODAS'
      ? todosLosItems.filter((i) => i.estado === query.estado)
      : todosLosItems;

  // 6. Aplicar paginación plana
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 6;
  const totalItems = itemsFiltrados.length;
  const offset = (page - 1) * pageSize;
  const itemsPaginados = itemsFiltrados.slice(offset, offset + pageSize);

  // 7. Retornar respuesta
  return toListadoEntregasResponse(itemsPaginados, page, pageSize, totalItems, resumen);
}

export async function obtenerFiltrosTablero(
  user: AuthUser
): Promise<OpcionesFiltrosEntregaResponseDTO> {
  // 1. Obtener alumno autenticado y su curso
  const { alumno } = await alumnoService.getAlumnoConCursoOrThrow(user);

  // 2. Consultar docentes vinculados al curso
  const docentes = await entregaRepository.findDocentesPorCurso(alumno.idCurso);

  // 3. Mapear y retornar respuesta
  return {
    docentes: docentes.map((d) => ({
      idDocente: d.id,
      nombre: d.nombre,
      apellido: d.apellido,
    })),
    estados: [...OPCIONES_FILTRO_ESTADO_ENTREGA],
  };
}

export async function obtenerDetalleEjercicio(
  user: AuthUser,
  idEjercicio: number
): Promise<DetalleEjercicioAlumnoResponseDTO> {
  // 1. Obtener alumno autenticado y validar curso
  const { alumno } = await alumnoService.getAlumnoConCursoOrThrow(user);

  // 2. Consultar ejercicio con la entrega del alumno
  const ejercicio = await entregaRepository.findDetalleEjercicioParaAlumno(idEjercicio, alumno.id);

  // 3. Validar existencia y estado disponible
  if (!ejercicio || ejercicio.estado !== 'PUBLICADO') {
    throw new NotFoundError('El ejercicio no se encuentra disponible.');
  }

  // 4. Validar pertenencia al curso del alumno
  if (ejercicio.cursoId !== alumno.idCurso) {
    throw new ForbiddenError('No tienes permisos para acceder a ejercicios de otro curso.');
  }

  // 5. Mapear y retornar detalle
  return toDetalleEjercicioAlumnoResponse(ejercicio);
}

export async function consultarResolucionAlumno(
  user: AuthUser,
  idEjercicio: number
): Promise<ResolucionAlumnoResponseDTO> {
  // 1. Obtener alumno autenticado y validar curso
  const { alumno } = await alumnoService.getAlumnoConCursoOrThrow(user);

  // 2. Consultar ejercicio con sus plantillas habilitadas
  const ejercicio = await entregaRepository.findEjercicioConPlantillas(idEjercicio);

  // 3. Validar existencia y publicación
  if (!ejercicio || ejercicio.estado !== 'PUBLICADO') {
    throw new NotFoundError('El ejercicio no se encuentra disponible.');
  }

  // 4. Validar pertenencia al curso del alumno
  if (ejercicio.curso.idCurso !== alumno.idCurso) {
    throw new ForbiddenError('No tienes permisos para acceder a ejercicios de otro curso.');
  }

  // 5. Obtener o inicializar la entrega del alumno
  const entrega = await entregaRepository.findOrCreateEntrega(idEjercicio, alumno.id);

  // 6. Mapear y retornar respuesta
  return toResolucionAlumnoResponse(ejercicio, entrega);
}

export async function guardarResolucionPlantilla(
  user: AuthUser,
  idEjercicio: number,
  body: GuardarPlantillaAlumnoBodyDTO
): Promise<GuardarPlantillaAlumnoResponseDTO> {
  // 1. Obtener alumno autenticado y validar curso
  const { alumno } = await alumnoService.getAlumnoConCursoOrThrow(user);

  // 2. Consultar ejercicio con sus plantillas habilitadas
  const ejercicio = await entregaRepository.findEjercicioConPlantillas(idEjercicio);

  // 3. Validar existencia y publicación
  if (!ejercicio || ejercicio.estado !== 'PUBLICADO') {
    throw new NotFoundError('El ejercicio no se encuentra disponible.');
  }

  // 4. Validar pertenencia al curso del alumno
  if (ejercicio.curso.idCurso !== alumno.idCurso) {
    throw new ForbiddenError('No tienes permisos para acceder a ejercicios de otro curso.');
  }

  // 5. Validar que la plantilla requerida esté habilitada en este ejercicio
  const plantilla = ejercicio.plantillas.find((p) => p.tipo === body.tipo);
  if (!plantilla) {
    throw new NotFoundError(`La plantilla ${body.tipo} no está habilitada en este ejercicio.`);
  }

  // 6. Obtener o inicializar la entrega del alumno
  const entrega = await entregaRepository.findOrCreateEntrega(idEjercicio, alumno.id);

  // 7. Bloqueo posterior a la entrega
  if (entrega.fechaEntrega) {
    throw new ConflictError('El ejercicio ya fue entregado y no admite modificaciones.');
  }

  // 8. Crear o actualizar la resolución de la plantilla específica
  const resolucionActualizada = await entregaRepository.upsertResolucionAlumnoPlantilla(
    entrega.idEntrega,
    plantilla.idEjercicioPlantilla,
    {
      estado: body.estado,
      contenido: body.contenido as Prisma.InputJsonValue,
    }
  );

  // 9. Mapear y retornar respuesta
  return toGuardarPlantillaAlumnoResponse(resolucionActualizada, body.tipo);
}
