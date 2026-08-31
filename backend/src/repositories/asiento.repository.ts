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

export async function findVentaPendienteById(
  idVenta: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.venta.findFirst({
    where: {
      idVenta,
      empresaId,
    },
    include: {
      asientoContable: {
        select: {
          idAsiento: true,
        },
      },
      pedido: {
        select: {
          clienteNombre: true,
          clienteMail: true,
        },
      },
      metodoPago: {
        select: {
          nombre: true,
        },
      },
      detalles: {
        include: {
          producto: {
            select: {
              nombre: true,
              precioUnitario: true,
            },
          },
        },
      },
    },
  });
}

export async function findMovimientoPendienteById(
  idMovimiento: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.movimientoFinanciero.findFirst({
    where: {
      idMovimiento,
      idEmpresa: empresaId,
    },
    include: {
      asientoContable: {
        select: {
          idAsiento: true,
        },
      },
      categoria: {
        include: {
          tipoMovimiento: true,
        },
      },
      metodoPago: true,
    },
  });
}

export async function findConciliacionPendienteById(
  idConciliacion: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.findFirst({
    where: {
      idConciliacion,
      empresaId,
    },
    include: {
      asientoContable: {
        select: {
          idAsiento: true,
        },
      },
    },
  });
}
