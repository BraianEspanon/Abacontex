import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

import {
  EstadoFiltroNotificacion,
  ObtenerNotificacionesQueryDTO,
} from '../validators/notificacion.validator';

import { NotFoundError } from '../errors/not-found.error';

export interface CrearNotificacionData {
  usuarioId: string;
  ejercicioId?: number | null;
  titulo: string;
  mensaje: string;
}

export async function crearNotificacionesMasivas(
  data: CrearNotificacionData[],
  tx?: Prisma.TransactionClient
): Promise<number> {
  const db = getDbClient(tx);

  const resultado = await db.notificacion.createMany({
    data,
  });

  return resultado.count;
}

function buildWhereByEstado(
  usuarioId: string,
  estado: EstadoFiltroNotificacion
): Prisma.NotificacionWhereInput {
  const where: Prisma.NotificacionWhereInput = { usuarioId };

  if (estado === 'NO_LEIDAS') {
    where.leida = false;
  } else if (estado === 'LEIDAS') {
    where.leida = true;
  }

  return where;
}

export async function findNotificacionesByUsuario(
  usuarioId: string,
  query: ObtenerNotificacionesQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  const where = buildWhereByEstado(usuarioId, query.estado);

  return db.notificacion.findMany({
    where,
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function countNotificacionesByUsuario(
  usuarioId: string,
  estado: EstadoFiltroNotificacion,
  tx?: Prisma.TransactionClient
): Promise<number> {
  const db = getDbClient(tx);
  const where = buildWhereByEstado(usuarioId, estado);

  return db.notificacion.count({
    where,
  });
}

export async function countNotificacionesNoLeidas(
  usuarioId: string,
  tx?: Prisma.TransactionClient
): Promise<number> {
  return countNotificacionesByUsuario(usuarioId, 'NO_LEIDAS', tx);
}

export async function findNotificacionById(idNotificacion: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.notificacion.findUnique({
    where: { idNotificacion },
  });
}

export async function findNotificacionByIdOrThrow(
  idNotificacion: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const notificacion = await findNotificacionById(idNotificacion, db);

  if (!notificacion) {
    throw new NotFoundError('Notificación no encontrada.');
  }

  return notificacion;
}

export async function marcarNotificacionComoLeida(
  idNotificacion: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.notificacion.update({
    where: { idNotificacion },
    data: { leida: true },
  });
}

export async function marcarTodasComoLeidasByUsuario(
  usuarioId: string,
  tx?: Prisma.TransactionClient
): Promise<number> {
  const db = getDbClient(tx);

  const resultado = await db.notificacion.updateMany({
    where: {
      usuarioId,
      leida: false,
    },
    data: {
      leida: true,
    },
  });

  return resultado.count;
}
