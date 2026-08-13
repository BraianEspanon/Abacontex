import { Prisma } from '@prisma/client';

import { getDbClient } from '../lib/prisma';

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
