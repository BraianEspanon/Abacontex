import { Prisma } from '@prisma/client';
import { prisma, getDbClient } from '../lib/prisma';
import { toProductoPedido } from '../dto/pedido/ped.mapper';
import { DetallePedidoCalculado, ProductoPedido } from '../models/pedido.models';
import { NotFoundError } from '../errors/not-found.error';

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
      precioVenta: true,
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
export async function findByIdAndEmpresaOrThrow(idPedido: number, empresaId: number) {
  const pedido = await findByIdAndEmpresa(idPedido, empresaId);

  if (!pedido) {
    throw new NotFoundError('Pedido no encontrado en base de datos.', {
      idPedido,
    });
  }

  return pedido;
}

export async function findByIdAndEmpresaForCambioEstado(idPedido: number, empresaId: number) {
  return prisma.pedido.findFirst({
    where: {
      idPedido,
      empresaId,
    },
    include: {
      estado: true,
      detalles: {
        select: {
          cantidadPendiente: true,
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

export async function findDetallePedido(pedidoId: number, productoId: number) {
  return prisma.detallePedido.findUnique({
    where: {
      pedidoId_productoId: {
        pedidoId,
        productoId,
      },
    },
  });
}
export async function findDetallePedidoOrThrow(pedidoId: number, productoId: number) {
  const detalle = await findDetallePedido(pedidoId, productoId);

  if (!detalle) {
    throw new NotFoundError(
      'No se pudo encontrar el producto dentro del pedido en la base de datos.',
      {
        pedido: pedidoId,
        producto: productoId,
      }
    );
  }

  return detalle;
}

export async function findEstadoPendiente() {
  return prisma.estadoPedido.findUniqueOrThrow({
    where: {
      nombre: 'PENDIENTE',
    },
  });
}

export async function findEstadoListoParaEntregar(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.estadoPedido.findUniqueOrThrow({
    where: {
      nombre: 'LISTO_PARA_ENTREGAR',
    },
  });
}

export async function findEstadoCompletado() {
  return prisma.estadoPedido.findUniqueOrThrow({
    where: {
      nombre: 'COMPLETADO',
    },
  });
}

export async function tieneFaltantes(pedidoId: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  const cantidadFaltantes = await db.detallePedido.count({
    where: {
      pedidoId,
      cantidadPendiente: {
        gt: 0,
      },
    },
  });

  return cantidadFaltantes > 0;
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

export async function updateEstadoPedido(
  idPedido: number,
  estadoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.pedido.update({
    where: {
      idPedido,
    },
    data: {
      estadoId,
    },
    include: {
      estado: true,
    },
  });
}

export async function cubrirFaltante(
  pedidoId: number,
  productoId: number,
  cantidad: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ?? prisma;

  return client.detallePedido.update({
    where: {
      pedidoId_productoId: {
        pedidoId,
        productoId,
      },
    },
    data: {
      cantidadConStock: {
        increment: cantidad,
      },
      cantidadPendiente: {
        decrement: cantidad,
      },
    },
  });
}
