import { AuthUser } from '../types/express';
import { NotFoundError } from '../errors/not-found.error';

import * as docenteRepository from '../repositories/docente.repository';
import * as correccionRepository from '../repositories/correccion.repository';

import {
  ObtenerEjerciciosACorregirQueryDTO,
  ObtenerEntregasEjercicioQueryDTO,
} from '../validators/correccion.validator';
import {
  OPCIONES_FILTRO_ESTADO_CORRECCION,
  OPCIONES_FILTRO_ESTADO_CORRECCION_ALUMNO,
} from '../constants/correccion.constants';
import {
  CabeceraEjercicioEntregasDTO,
  FiltrosEntregasEjercicioDTO,
  ListadoEjerciciosACorregirResponseDTO,
  ListadoEntregasEjercicioResponseDTO,
  OpcionesFiltrosCorreccionResponseDTO,
  ResumenTableroCorreccionesDTO,
} from '../dto/correccion/correccion.dto';
import {
  formatearNombresPlantillas,
  toItemAlumnoEntrega,
  toItemTableroCorreccion,
  toListadoEjerciciosACorregirResponse,
  toListadoEntregasEjercicioResponse,
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

export async function obtenerEntregasEjercicio(
  user: AuthUser,
  ejercicioId: number,
  query: ObtenerEntregasEjercicioQueryDTO
): Promise<ListadoEntregasEjercicioResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio con alumnos del curso y sus entregas
  const ejercicio = await correccionRepository.findEjercicioConEntregasYAlumnos(
    ejercicioId,
    docente.id
  );

  if (!ejercicio) {
    throw new NotFoundError('Ejercicio no encontrado o no pertenece al docente.');
  }

  // 3. Cruzar todos los alumnos del curso con sus entregas
  const totalPlantillas = ejercicio.plantillas.length;
  const fechaLimite = ejercicio.fechaLimite;

  const todosLosItems = ejercicio.curso.alumnos.map((alumno) => {
    const entrega = ejercicio.entregas.find((e) => e.alumnoId === alumno.id);
    return toItemAlumnoEntrega(alumno, entrega, fechaLimite, totalPlantillas);
  });

  // 4. Calcular métricas de cabecera del ejercicio
  const totalAlumnos = todosLosItems.length;
  const totalEntregasRecibidas = todosLosItems.filter((i) => i.estado !== 'SIN_ENTREGAR').length;
  const entregasCorregidas = todosLosItems.filter((i) => i.estado === 'CORREGIDA').length;
  const entregasPendientes = todosLosItems.filter(
    (i) => i.estado === 'PENDIENTE' || i.estado === 'EN_CORRECCION'
  ).length;
  const cantidadSinEntregar = todosLosItems.filter((i) => i.estado === 'SIN_ENTREGAR').length;

  const cabecera: CabeceraEjercicioEntregasDTO = {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
    },
    plantillasHabilitadas: formatearNombresPlantillas(ejercicio.plantillas.map((p) => p.tipo)),
    totalAlumnos,
    totalEntregasRecibidas,
    entregasCorregidas,
    entregasPendientes,
    cantidadSinEntregar,
  };

  // 5. Opciones para los filtros de la pantalla
  const filtros: FiltrosEntregasEjercicioDTO = {
    estados: OPCIONES_FILTRO_ESTADO_CORRECCION_ALUMNO.map((o) => ({
      clave: o.clave,
      label: o.label,
    })),
  };

  // 6. Filtrar por búsqueda de alumno si se especificó
  let itemsFiltrados = todosLosItems;
  if (query.busqueda) {
    const termino = query.busqueda.toLowerCase();
    itemsFiltrados = itemsFiltrados.filter(
      (i) =>
        i.nombre.toLowerCase().includes(termino) ||
        i.apellido.toLowerCase().includes(termino) ||
        i.email.toLowerCase().includes(termino)
    );
  }

  // 7. Filtrar por estado de corrección si es distinto de 'TODAS'
  if (query.estado && query.estado !== 'TODAS') {
    itemsFiltrados = itemsFiltrados.filter((i) => i.estado === query.estado);
  }

  // 8. Paginación en memoria
  const { page = 1, pageSize = 10 } = query;
  const skip = (page - 1) * pageSize;
  const itemsPaginados = itemsFiltrados.slice(skip, skip + pageSize);

  // 9. Retornar DTO de respuesta
  return toListadoEntregasEjercicioResponse(
    itemsPaginados,
    page,
    pageSize,
    itemsFiltrados.length,
    cabecera,
    filtros
  );
}
