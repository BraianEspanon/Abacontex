import { Prisma, TipoFactura, CondicionFiscal } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { GenerarFacturaDTO } from '../validators/factura.validator';
import { NotFoundError } from '../errors/not-found.error';

export async function findByVentaId(ventaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.factura.findUnique({
    where: {
      ventaId,
    },
  });
}

export async function create(data: GenerarFacturaDTO, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.factura.create({
    data: {
      ventaId: data.ventaId,
      tipoFactura: data.tipoFactura as TipoFactura,
      condicionFiscal: data.condicionFiscal as CondicionFiscal,
    },
  });
}

export async function findByIdAndEmpresaFull(
  idFactura: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.factura.findFirst({
    where: {
      idFactura,
      venta: {
        empresaId,
      },
    },
    include: {
      venta: {
        include: {
          empresa: {
            select: {
              nombre: true,
              fechaCreacion: true,
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
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function findByIdAndEmpresaFullOrThrow(
  idFactura: number,
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const factura = await findByIdAndEmpresaFull(idFactura, empresaId, tx);

  if (!factura) {
    throw (
      new NotFoundError('Factura no encontrada o no pertenece a la empresa.'),
      { idFactura, empresaId }
    );
  }

  return factura;
}
