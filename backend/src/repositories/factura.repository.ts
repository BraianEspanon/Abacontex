import { Prisma, TipoFactura, CondicionFiscal } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { GenerarFacturaDTO } from '../validators/factura.validator';

export async function findByVentaId(ventaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.factura.findUnique({
    where: {
      ventaId,
    },
  });
}

export async function create(
  data: GenerarFacturaDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.factura.create({
    data: {
      ventaId: data.ventaId,
      tipoFactura: data.tipoFactura as TipoFactura,
      condicionFiscal: data.condicionFiscal as CondicionFiscal,
    },
  });
}
