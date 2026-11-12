import {
  SimulacionAlumnoListItemEntity,
  SimulacionCreadaEntity,
} from '../../repositories/simulacion.repository';
import { EstadoParticipacionSimulacion } from '../../constants/simulacion.constants';
import {
  adaptarTituloSimulacion,
  calcularProgresoSimulacion,
  puedeRolResponderEvento,
  resolverUltimaActividadSimulacion,
} from '../../utils/simulacion.util';
import {
  CabeceraEntregasSimulacionDTO,
  EntregaSimulacionEmpresaItemDTO,
  EntregasSimulacionResponseDTO,
  ListarSimulacionesAlumnoResponseDTO,
  ListarSimulacionesDocenteResponseDTO,
  ResumenDashboardAlumnoDTO,
  ResumenDashboardDocenteDTO,
  SimulacionAlumnoCardDTO,
  SimulacionCreadaResponseDTO,
  SimulacionDocenteCardDTO,
} from './simulacion.dto';

export function toSimulacionCreadaResponse(
  simulacion: SimulacionCreadaEntity,
  empresasParticipantes: number
): SimulacionCreadaResponseDTO {
  return {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    flujoEmpresarial: simulacion.flujoEmpresarial,
    dificultad: simulacion.dificultad,
    duracion: simulacion.duracion,
    eventosSorpresa: simulacion.eventosSorpresa,
    usarDatosEmpresa: simulacion.usarDatosEmpresa,
    fechaLimite: simulacion.fechaLimite.toISOString(),
    estado: simulacion.estado,
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
      año: simulacion.curso.año,
    },
    empresasParticipantes,
    createdAt: simulacion.createdAt.toISOString(),
    updatedAt: simulacion.updatedAt.toISOString(),
  };
}

export interface SimulacionDocenteListItemEntity {
  idSimulacion: number;
  titulo: string;
  fechaLimite: Date;
  createdAt: Date;
  updatedAt: Date;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  empresas: {
    idSimulacionEmpresa: number;
    estado: string;
    puntajeFinal: number | null;
  }[];
}

export function toSimulacionDocenteCard(
  simulacion: SimulacionDocenteListItemEntity
): SimulacionDocenteCardDTO {
  const empresasTotales = simulacion.empresas.length;
  const empresasQueHanEmpezado = simulacion.empresas.filter(
    (e) => e.estado === 'EN_CURSO' || e.estado === 'FINALIZADA'
  ).length;
  const finalizadas = simulacion.empresas.filter((e) => e.estado === 'FINALIZADA');
  const empresasFinalizadas = finalizadas.length;

  let puntajePromedio: number | null = null;
  if (empresasFinalizadas > 0) {
    const totalPuntos = finalizadas.reduce((acc, e) => acc + (e.puntajeFinal ?? 0), 0);
    puntajePromedio = Math.round(totalPuntos / empresasFinalizadas);
  }

  let estado: EstadoParticipacionSimulacion = EstadoParticipacionSimulacion.PENDIENTE;
  if (empresasTotales > 0 && empresasFinalizadas === empresasTotales) {
    estado = EstadoParticipacionSimulacion.FINALIZADA;
  } else if (empresasQueHanEmpezado > 0) {
    estado = EstadoParticipacionSimulacion.EN_CURSO;
  }

  return {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    estado,
    fechaLimite: simulacion.fechaLimite.toISOString(),
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
    },
    empresasQueHanEmpezado,
    empresasTotales,
    puntajePromedio,
    createdAt: simulacion.createdAt.toISOString(),
    updatedAt: simulacion.updatedAt.toISOString(),
  };
}

export function toListarSimulacionesDocenteResponse(
  items: SimulacionDocenteListItemEntity[],
  totalItems: number,
  page: number,
  pageSize: number,
  resumen: ResumenDashboardDocenteDTO
): ListarSimulacionesDocenteResponseDTO {
  return {
    items: items.map(toSimulacionDocenteCard),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
    resumen,
  };
}

export interface SimulacionEmpresaEntregaEntity {
  idSimulacionEmpresa: number;
  empresaId: number;
  estado: string;
  puntajeFinal: number | null;
  fechaInicio: Date | null;
  fechaFinalizacion: Date | null;
  empresa: {
    id: number;
    nombre: string;
    logoUrl: string | null;
    alumnos: {
      id: string;
      rolEmpresa: {
        idRol: number;
        nombreRol: string;
      } | null;
    }[];
  };
  _count: {
    eventos: number;
    decisiones: number;
  };
  decisiones: {
    fechaDecision: Date;
    rolEmpresa: {
      nombreRol: string;
    };
  }[];
}

export function toEntregaSimulacionEmpresaItem(
  entity: SimulacionEmpresaEntregaEntity
): EntregaSimulacionEmpresaItemDTO {
  const { eventosCompletados, porcentajeProgreso } = calcularProgresoSimulacion(
    entity.estado,
    entity._count.eventos,
    entity._count.decisiones
  );

  const rolesInvolucrados = Array.from(
    new Set(
      entity.empresa.alumnos
        .map((a) => a.rolEmpresa?.nombreRol)
        .filter((r): r is string => Boolean(r))
    )
  );

  const ultimaActividad = resolverUltimaActividadSimulacion(
    entity.decisiones,
    entity.fechaFinalizacion,
    entity.fechaInicio
  );

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    empresaId: entity.empresa.id,
    nombreEmpresa: entity.empresa.nombre,
    logoUrl: entity.empresa.logoUrl,
    cantidadIntegrantes: entity.empresa.alumnos.length,
    rolesInvolucrados,
    estado: entity.estado,
    eventosCompletados,
    eventosTotales: entity._count.eventos,
    porcentajeProgreso,
    puntajeFinal: entity.puntajeFinal,
    ultimaActividad,
    fechaFinalizacion: entity.fechaFinalizacion?.toISOString() ?? null,
  };
}

export function toEntregasSimulacionResponse(
  simulacion: CabeceraEntregasSimulacionDTO,
  items: SimulacionEmpresaEntregaEntity[],
  totalItems: number,
  page: number,
  pageSize: number
): EntregasSimulacionResponseDTO {
  return {
    simulacion,
    items: items.map(toEntregaSimulacionEmpresaItem),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
  };
}

export function toSimulacionAlumnoCard(
  entity: SimulacionAlumnoListItemEntity,
  rolAlumno: string | null
): SimulacionAlumnoCardDTO {
  const { eventoActualNumero, porcentajeProgreso } = calcularProgresoSimulacion(
    entity.estado,
    entity._count.eventos,
    entity._count.decisiones
  );

  const requiereMiDecision =
    entity.estado === 'EN_CURSO' &&
    entity.eventoActual?.tipo === 'DECISION' &&
    puedeRolResponderEvento(entity.eventoActual.rolesHabilitados, rolAlumno);

  const titulo = adaptarTituloSimulacion(
    entity.simulacion.titulo,
    entity.empresa?.nombre,
    entity.estadoInterno?.variables,
    entity.simulacion.usarDatosEmpresa
  );

  const ultimaActividad = resolverUltimaActividadSimulacion(
    entity.decisiones,
    entity.fechaFinalizacion,
    entity.fechaInicio
  );

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    titulo,
    estado: entity.estado,
    requiereMiDecision,
    eventoActualNumero,
    cantEventosTotales: entity._count.eventos,
    porcentajeProgreso,
    fechaLimite: entity.simulacion.fechaLimite.toISOString(),
    ultimaActividad,
  };
}

export function toListarSimulacionesAlumnoResponse(
  items: SimulacionAlumnoListItemEntity[],
  totalItems: number,
  page: number,
  pageSize: number,
  resumen: ResumenDashboardAlumnoDTO,
  rolAlumno: string | null
): ListarSimulacionesAlumnoResponseDTO {
  return {
    items: items.map((item) => toSimulacionAlumnoCard(item, rolAlumno)),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
    resumen,
  };
}
