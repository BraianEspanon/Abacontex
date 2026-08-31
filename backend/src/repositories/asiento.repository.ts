import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

export async function findVentasPendientes(empresaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.venta.findMany({
    where: {
      empresaId,
      asientoContable: null,
    },
    include: {
      pedido: {
        select: {
          clienteNombre: true,
        },
      },
    },
    orderBy: {
      fecha: 'asc',
    },
  });
}

export async function findMovimientosPendientes(empresaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.movimientoFinanciero.findMany({
    where: {
      idEmpresa: empresaId,
      ventaId: null, // Omitir movimientos financieros automáticos originados por ventas
      asientoContable: null,
    },
    orderBy: {
      fecha: 'asc',
    },
  });
}

export async function findConciliacionesPendientes(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.findMany({
    where: {
      empresaId,
      diferencia: {
        not: 0,
      },
      asientoContable: null,
    },
    orderBy: {
      fecha: 'asc',
    },
  });
}
