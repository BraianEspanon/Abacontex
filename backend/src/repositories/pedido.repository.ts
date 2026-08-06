import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { toProductoPedido } from '../dto/pedido/ped.mapper';
import { DetallePedidoCalculado, ProductoPedido } from '../models/pedido.models';

export async function findProductosByIdsAndEmpresa(
  empresaId: number,
  productoIds: number[]
): Promise<ProductoPedido[]> {
  const productos = await prisma.producto.findMany({
    where: {
      empresaId,
      activo: true,
      id: {
        in: productoIds,
      },
    },
    select: {
      id: true,
      nombre: true,
      stock: true,
      precioUnitario: true,
    },
  });

  return productos.map(toProductoPedido);
}

export async function findByIdAndEmpresa(idPedido: number, empresaId: number) {
  return prisma.pedido.findFirst({
    where: {
      idPedido,
      empresaId,
    },
    include: {
      estado: true,
      usuario: {
        select: {
          nombre: true,
          apellido: true,
        },
      },
      detalles: {
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              fotoUrl: true,
            },
          },
        },
      },
    },
  });
}
export async function findKanbanByEmpresa(empresaId: number) {
  return prisma.pedido.findMany({
    where: {
      empresaId,
    },
    orderBy: {
      fecha: 'desc',
    },
    include: {
      estado: {
        select: {
          nombre: true,
        },
      },
      detalles: {
        select: {
          cantidadPendiente: true,
        },
      },
    },
  });
}

export async function findEstadoPendiente() {
  return prisma.estadoPedido.findUniqueOrThrow({
    where: {
      nombre: 'PENDIENTE',
    },
  });
}
export async function createPedido(
  data: Prisma.PedidoCreateInput,
  detalles: DetallePedidoCalculado[]
) {
  return prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.create({
      data: {
        ...data,
        detalles: {
          create: detalles.map((detalle) => ({
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            cantidadConStock: detalle.cantidadConStock,
            cantidadPendiente: detalle.cantidadPendiente,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
          })),
        },
      },
      include: {
        estado: true,
        detalles: true,
      },
    });

    for (const detalle of detalles) {
      if (detalle.cantidadConStock === 0) {
        continue;
      }

      await tx.producto.update({
        where: {
          id: detalle.productoId,
        },
        data: {
          stock: {
            decrement: detalle.cantidadConStock,
          },
        },
      });
    }

    return pedido;
  });
}
