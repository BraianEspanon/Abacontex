import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

export async function findDisponiblesPorAño(año: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.metodoPagoCurso.findMany({
    where: {
      año,
    },
    select: {
      metodoPago: {
        select: {
          idMetodoPago: true,
          nombre: true,
        },
      },
    },
    orderBy: {
      idMetodoPago: 'asc',
    },
  });
}

export async function findByIdAndAño(
  idMetodoPago: number,
  año: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.metodoPagoCurso.findUnique({
    where: {
      idMetodoPago_año: {
        idMetodoPago,
        año,
      },
    },
    include: {
      metodoPago: true,
    },
  });
}
