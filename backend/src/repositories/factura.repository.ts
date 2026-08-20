import { Prisma, TipoFactura, CondicionFiscal } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { GenerarFacturaDTO, ObtenerFacturasDTO } from '../validators/factura.validator';
import { NotFoundError } from '../errors/not-found.error';

export async function findByVentaId(ventaId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.factura.findUnique({
    where: {
      ventaId,
    },
  });
}

export async function create(
  data: GenerarFacturaDTO & { cai: string; fechaVencimiento: Date; localidad: string },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.factura.create({
    data: {
      ventaId: data.ventaId,
      tipoFactura: data.tipoFactura as TipoFactura,
      condicionFiscal: data.condicionFiscal as CondicionFiscal,
      cai: data.cai,
      fechaVencimiento: data.fechaVencimiento,
      localidad: data.localidad,
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

export async function obtenerResumenFacturas(
  empresaId: number,
  fechaInicioMes: Date,
  fechaFinMes: Date,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const [facturasEmitidas, ventasPendientes, facturacionMesAgg, montoFacturadoAgg] =
    await Promise.all([
      db.factura.count({ where: { venta: { empresaId } } }),
      db.venta.count({ where: { empresaId, factura: null, estado: 'CONFIRMADA' } }),
      db.venta.aggregate({
        _sum: { totalFinal: true },
        where: {
          empresaId,
          factura: { fechaEmision: { gte: fechaInicioMes, lte: fechaFinMes } },
        },
      }),
      db.venta.aggregate({
        _sum: { totalFinal: true },
        where: {
          empresaId,
          factura: { isNot: null },
        },
      }),
    ]);

  return {
    facturasEmitidas,
    ventasPendientes,
    facturacionMes: Number(facturacionMesAgg._sum.totalFinal || 0),
    montoFacturado: Number(montoFacturadoAgg._sum.totalFinal || 0),
  };
}

export async function findFacturasByEmpresa(
  empresaId: number,
  filtros: ObtenerFacturasDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.FacturaWhereInput = {
    venta: {
      empresaId,
    },
  };

  if (filtros.search) {
    where.venta = {
      empresaId,
      pedido: {
        clienteNombre: {
          contains: filtros.search,
          mode: 'insensitive',
        },
      },
    };
  }

  if (filtros.tipoFactura) {
    where.tipoFactura = filtros.tipoFactura;
  }

  if (filtros.mes) {
    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(añoActual, filtros.mes - 1, 1);
    const fechaFin = new Date(añoActual, filtros.mes, 0, 23, 59, 59, 999);

    where.fechaEmision = {
      gte: fechaInicio,
      lte: fechaFin,
    };
  }

  const skip = (filtros.page - 1) * filtros.pageSize;

  const [total, items] = await Promise.all([
    db.factura.count({ where }),
    db.factura.findMany({
      where,
      include: {
        venta: {
          include: {
            pedido: {
              select: { clienteNombre: true },
            },
          },
        },
      },
      orderBy: { fechaEmision: 'desc' },
      skip,
      take: filtros.pageSize,
    }),
  ]);

  return { total, items };
}
