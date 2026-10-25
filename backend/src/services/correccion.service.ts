import { AuthUser } from '../types/express';

import * as docenteRepository from '../repositories/docente.repository';
import * as correccionRepository from '../repositories/correccion.repository';

import { ObtenerEjerciciosACorregirQueryDTO } from '../validators/correccion.validator';
import { OPCIONES_FILTRO_ESTADO_CORRECCION } from '../constants/correccion.constants';
import {
  ListadoEjerciciosACorregirResponseDTO,
  OpcionesFiltrosCorreccionResponseDTO,
  ResumenTableroCorreccionesDTO,
} from '../dto/correccion/correccion.dto';
import {
  toItemTableroCorreccion,
  toListadoEjerciciosACorregirResponse,
} from '../dto/correccion/correccion.mapper';

export async function obtenerEjerciciosACorregir(
  user: AuthUser,
  query: ObtenerEjerciciosACorregirQueryDTO
): Promise<ListadoEjerciciosACorregirResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicios publicados del docente
  const ejercicios = await correccionRepository.findEjerciciosParaTableroCorreccion(docente.id, {
    busqueda: query.busqueda,
    cursoId: query.cursoId,
  });

  // 3. Mapear y calcular estados dinámicos por ejercicio
  const todosLosItems = ejercicios.map((ej) => toItemTableroCorreccion(ej));

  // 4. Calcular métricas de resumen para las cards superiores del tablero
  const resumen: ResumenTableroCorreccionesDTO = {
    total: todosLosItems.length,
    sinEntregas: todosLosItems.filter((i) => i.estado === 'SIN_ENTREGAS').length,
    pendientes: todosLosItems.filter((i) => i.estado === 'PENDIENTE').length,
    enCorreccion: todosLosItems.filter((i) => i.estado === 'EN_CORRECCION').length,
    corregidos: todosLosItems.filter((i) => i.estado === 'CORREGIDO').length,
  };

  // 5. Filtrar por estado si se especificó y no es 'TODAS'
  const itemsFiltrados =
    query.estado && query.estado !== 'TODAS'
      ? todosLosItems.filter((i) => i.estado === query.estado)
      : todosLosItems;

  // 6. Paginar en memoria
  const { page = 1, pageSize = 6 } = query;
  const skip = (page - 1) * pageSize;
  const itemsPaginados = itemsFiltrados.slice(skip, skip + pageSize);

  // 7. Retornar DTO paginado ensamblado
  return toListadoEjerciciosACorregirResponse(
    itemsPaginados,
    page,
    pageSize,
    itemsFiltrados.length,
    resumen
  );
}

export async function obtenerFiltrosTableroCorreccion(
  user: AuthUser
): Promise<OpcionesFiltrosCorreccionResponseDTO> {
  const cursos = await docenteRepository.findCursosByDocente(user.keycloakId);

  return {
    cursos: cursos.map((c) => ({
      idCurso: c.idCurso,
      nombreCurso: c.nombreCurso,
    })),
    estados: OPCIONES_FILTRO_ESTADO_CORRECCION.map((opcion) => ({
      clave: opcion.clave,
      label: opcion.label,
    })),
  };
}
