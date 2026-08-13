import { Prisma } from '@prisma/client';

import { getDbClient } from '../lib/prisma';
import { NotFoundError } from '../errors/not-found.error';

export async function create(
  data: Prisma.VentaUncheckedCreateInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.venta.create({
    data,
  });
}

export async function createDetalles(
  ventaId: number,
  detalles: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: Prisma.Decimal;
    subtotal: Prisma.Decimal;
  }>,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.detalleVenta.createMany({
    data: detalles.map((detalle) => ({
      ventaId,
      productoId: detalle.productoId,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.subtotal,
    })),
  });
}

export async function findByIdAndEmpresa(
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
      pedido: {
        select: {
          idPedido: true,
          clienteNombre: true,
          clienteMail: true,
        },
      },
      metodoPago: {
        select: {
          idMetodoPago: true,
          nombre: true,
        },
      },
      detalles: {
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
    },
  });
}

export async function findByIdAndEmpresaOrThrow(
  idVenta: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const venta = await findByIdAndEmpresa(idVenta, empresaId, tx);

  if (!venta) {
    throw new NotFoundError('Venta no encontrada.', {
      idVenta,
      empresaId,
    });
  }

  return venta;
}
