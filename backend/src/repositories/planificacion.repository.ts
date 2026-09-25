import { Prisma } from '@prisma/client';
import { EstadoPlanificacion } from '../constants/estados-planificacion';

import { getDbClient } from '../lib/prisma';

import { NotFoundError } from '../errors/not-found.error';

export async function findByEmpresaAndCiclo(
  empresaId: number,
  cicloLectivoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.planificacionAnual.findUnique({
    where: {
      empresaId_cicloLectivoId: {
        empresaId,
        cicloLectivoId,
      },
    },
    include: {
      detalles: {
        orderBy: {
          mes: 'asc',
        },
      },
    },
  });
}

export async function findDetalleByIdAndEmpresaAndCiclo(
  idDetalle: number,
  empresaId: number,
  cicloLectivoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.detallePlanificacionAnual.findFirst({
    where: {
      idDetalle,
      planificacion: {
        empresaId,
        cicloLectivoId,
      },
    },
  });
}

export async function findDetalleByIdAndEmpresaAndCicloOrThrow(
  idDetalle: number,
  empresaId: number,
  cicloLectivoId: number,
  tx?: Prisma.TransactionClient
) {
  const detalle = await findDetalleByIdAndEmpresaAndCiclo(idDetalle, empresaId, cicloLectivoId, tx);

  if (!detalle) {
    throw new NotFoundError('No se encontró la planificación mensual.');
  }

  return detalle;
}

export async function findProduccionFinalizadaPorMes(
  empresaId: number,
  fechaInicio: Date,
  fechaFin: Date,
  estadoFinalizadaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.historialEstadoOrdenProduccion.findMany({
    where: {
      estadoId: estadoFinalizadaId,
      fechaInicio: {
        gte: fechaInicio,
        lt: fechaFin,
      },
      orden: {
        empresaId,
      },
    },
    select: {
      fechaInicio: true,
      orden: {
        select: {
          cantidad: true,
        },
      },
    },
    orderBy: {
      fechaInicio: 'asc',
    },
  });
}

export async function create(
  data: {
    empresaId: number;
    cicloLectivoId: number;
    mesInicio: number;
    mesFin: number;
    estado: EstadoPlanificacion;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.planificacionAnual.create({
    data: {
      empresaId: data.empresaId,
      cicloLectivoId: data.cicloLectivoId,
      mesInicio: data.mesInicio,
      mesFin: data.mesFin,
      estado: data.estado,
    },
  });
}

export async function createDetalle(
  data: {
    planificacionId: number;
    mes: number;
    unidadesEstimadas: number | null;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.detallePlanificacionAnual.create({
    data: {
      planificacionId: data.planificacionId,
      mes: data.mes,
      unidadesEstimadas: data.unidadesEstimadas,
    },
  });
}

export async function updateDetalle(
  idDetalle: number,
  unidadesEstimadas: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.detallePlanificacionAnual.update({
    where: {
      idDetalle,
    },
    data: {
      unidadesEstimadas,
    },
  });
}
