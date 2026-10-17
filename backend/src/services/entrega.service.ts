import { AuthUser } from '../types/express';

import * as alumnoService from './alumno.service';

import * as entregaRepository from '../repositories/entrega.repository';

import { ObtenerEntregasAlumnoQueryDTO } from '../validators/entrega.validator';

import { OPCIONES_FILTRO_ESTADO_ENTREGA } from '../constants/entrega.constants';

import {
  ListadoEntregasAlumnoResponseDTO,
  OpcionesFiltrosEntregaResponseDTO,
  ResumenTableroEntregasDTO,
} from '../dto/entrega/entrega.dto';

import { toItemTableroEntrega, toListadoEntregasResponse } from '../dto/entrega/entrega.mapper';

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
