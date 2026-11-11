import { SimulacionCreadaEntity } from '../../repositories/simulacion.repository';
import {
  ListarSimulacionesDocenteResponseDTO,
  ResumenDashboardDocenteDTO,
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

  let estado: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA' = 'PENDIENTE';
  if (empresasTotales > 0 && empresasFinalizadas === empresasTotales) {
    estado = 'FINALIZADA';
  } else if (empresasQueHanEmpezado > 0) {
    estado = 'EN_CURSO';
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
