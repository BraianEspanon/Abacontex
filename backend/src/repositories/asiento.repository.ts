import { Prisma, TipoOrigenAsiento, MovimientoCuentaContable } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { NotFoundError } from '../errors/not-found.error';

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

export async function findUltimoNumeroAsientoByEmpresa(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const ultimoAsiento = await db.asientoContable.findFirst({
    where: { empresaId },
    orderBy: { numeroAsiento: 'desc' },
    select: { numeroAsiento: true },
  });

  return ultimoAsiento?.numeroAsiento ?? 0;
}

export async function findFolioCuentaEmpresa(
  empresaId: number,
  cuentaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.folioCuentaEmpresa.findUnique({
    where: {
      empresaId_cuentaId: {
        empresaId,
        cuentaId,
      },
    },
  });
}

export async function findUltimoNumeroFolioByEmpresa(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const ultimoFolio = await db.folioCuentaEmpresa.findFirst({
    where: { empresaId },
    orderBy: { numeroFolio: 'desc' },
    select: { numeroFolio: true },
  });

  return ultimoFolio?.numeroFolio ?? 0;
}

export async function createFolioCuentaEmpresa(
  data: {
    empresaId: number;
    cuentaId: number;
    numeroFolio: number;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.folioCuentaEmpresa.create({
    data: {
      empresaId: data.empresaId,
      cuentaId: data.cuentaId,
      numeroFolio: data.numeroFolio,
    },
  });
}

export interface CrearAsientoDataInput {
  empresaId: number;
  alumnoId: string;
  numeroAsiento: number;
  fecha: Date;
  conceptoGeneral: string;
  origen: TipoOrigenAsiento;
  ventaId?: number | null | undefined;
  movimientoFinancieroId?: number | null | undefined;
  conciliacionId?: number | null | undefined;
  detalles: Array<{
    cuentaId: number;
    orden: number;
    movimiento: MovimientoCuentaContable;
    debe: number;
    haber: number;
  }>;
}

export async function createAsientoContable(
  data: CrearAsientoDataInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.asientoContable.create({
    data: {
      empresaId: data.empresaId,
      alumnoId: data.alumnoId,
      numeroAsiento: data.numeroAsiento,
      fecha: data.fecha,
      conceptoGeneral: data.conceptoGeneral,
      origen: data.origen,
      ventaId: data.ventaId ?? null,
      movimientoFinancieroId: data.movimientoFinancieroId ?? null,
      conciliacionId: data.conciliacionId ?? null,
      detalles: {
        createMany: {
          data: data.detalles.map((d) => ({
            cuentaId: d.cuentaId,
            orden: d.orden,
            movimiento: d.movimiento,
            debe: d.debe,
            haber: d.haber,
          })),
        },
      },
    },
    include: {
      detalles: {
        include: {
          cuenta: {
            select: {
              idCuenta: true,
              codigo: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          orden: 'asc',
        },
      },
    },
  });
}

export async function findAllCuentasConFolioByEmpresa(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.cuentaContable.findMany({
    where: {
      activo: true,
    },
    include: {
      foliosEmpresa: {
        where: {
          empresaId,
        },
        select: {
          numeroFolio: true,
        },
      },
    },
    orderBy: {
      codigo: 'asc',
    },
  });
}

export async function findUltimosAsientosByEmpresa(
  empresaId: number,
  limit: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.asientoContable.findMany({
    where: {
      empresaId,
    },
    include: {
      detalles: {
        include: {
          cuenta: {
            select: {
              idCuenta: true,
              codigo: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          orden: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

export async function countAsientosByEmpresa(empresaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.asientoContable.count({
    where: {
      empresaId,
    },
  });
}

export async function findLibroDiarioByEmpresa(empresaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.asientoContable.findMany({
    where: {
      empresaId,
    },
    include: {
      detalles: {
        include: {
          cuenta: {
            select: {
              idCuenta: true,
              codigo: true,
              nombre: true,
              foliosEmpresa: {
                where: {
                  empresaId,
                },
                select: {
                  numeroFolio: true,
                },
              },
            },
          },
        },
        orderBy: {
          orden: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function findAsientoByIdAndEmpresa(
  idAsiento: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.asientoContable.findFirst({
    where: {
      idAsiento,
      empresaId,
    },
    include: {
      detalles: {
        include: {
          cuenta: {
            select: {
              idCuenta: true,
              codigo: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          orden: 'asc',
        },
      },
    },
  });
}

export async function findAsientoByIdAndEmpresaOrThrow(
  idAsiento: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const asiento = await findAsientoByIdAndEmpresa(idAsiento, empresaId, tx);

  if (!asiento) {
    throw new NotFoundError(
      'El asiento contable solicitado no existe o no pertenece a tu empresa.'
    );
  }

  return asiento;
}
