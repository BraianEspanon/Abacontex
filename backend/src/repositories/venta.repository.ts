import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

import { NotFoundError } from '../errors/not-found.error';

import { ObtenerVentasQueryDTO } from '../validators/venta.validator';

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

export async function findByEmpresa(
  empresaId: number,
  filtros?: ObtenerVentasQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.VentaWhereInput = {
    empresaId,
  };

  if (filtros?.search) {
    const isNumber = !isNaN(Number(filtros.search));
    where.OR = [
      ...(isNumber
        ? [{ idVenta: Number(filtros.search) }, { pedidoId: Number(filtros.search) }]
        : []),
      {
        pedido: {
          clienteNombre: {
            contains: filtros.search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  if (filtros?.metodoPagoId) {
    where.metodoPagoId = filtros.metodoPagoId;
  }

  if (filtros?.mes) {
    const añoActual = new Date().getFullYear();
    const fechaInicioMes = new Date(añoActual, filtros.mes - 1, 1);
    const fechaFinMes = new Date(añoActual, filtros.mes, 0, 23, 59, 59, 999);

    where.fecha = {
      gte: fechaInicioMes,
      lte: fechaFinMes,
    };
  }

  return db.venta.findMany({
    where,
    include: {
      pedido: {
        select: {
          idPedido: true,
          clienteNombre: true,
        },
      },
      metodoPago: {
        select: {
          idMetodoPago: true,
          nombre: true,
        },
      },
    },
    orderBy: {
      fecha: 'desc',
    },
  });
}

export async function findVentasPendientesFacturacion(
  empresaId: number,
  filtros: { page: number; pageSize: number },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.VentaWhereInput = {
    empresaId,
    factura: null, // Que no tenga factura asociada
    estado: 'CONFIRMADA',
  };

  const skip = (filtros.page - 1) * filtros.pageSize;

  const [total, items] = await Promise.all([
    db.venta.count({ where }),
    db.venta.findMany({
      where,
      include: {
        pedido: {
          select: {
            clienteNombre: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
      skip,
      take: filtros.pageSize,
    }),
  ]);

  return { total, items };
}

export async function obtenerResumenVentas(
  empresaId: number,
  fechaInicioMes: Date,
  fechaFinMes: Date,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const [totalVentas, totalVendidoAgg, ventasMes] = await Promise.all([
    db.venta.count({
      where: {
        empresaId,
      },
    }),
    db.venta.aggregate({
      where: {
        empresaId,
      },
      _sum: {
        totalFinal: true,
      },
    }),
    db.venta.count({
      where: {
        empresaId,
        fecha: {
          gte: fechaInicioMes,
          lte: fechaFinMes,
        },
      },
    }),
  ]);

  return {
    totalVentas,
    totalVendido: Number(totalVendidoAgg._sum.totalFinal ?? new Prisma.Decimal(0)),
    ventasMes,
  };
}
