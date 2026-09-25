import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

export async function findLibroMayorByEmpresa(empresaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.detalleAsientoContable.findMany({
    where: {
      asiento: {
        empresaId,
      },
    },
    select: {
      cuentaId: true,
      debe: true,
      haber: true,
      cuenta: {
        select: {
          idCuenta: true,
          codigo: true,
          nombre: true,
          rubro: {
            select: {
              tipoCuenta: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          foliosEmpresa: {
            where: { empresaId },
            select: { numeroFolio: true },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      cuenta: {
        codigo: 'asc',
      },
    },
  });
}
