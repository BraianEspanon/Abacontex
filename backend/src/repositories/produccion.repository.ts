import { prisma } from '../lib/prisma';
import { Prisma, PrioridadOrden } from '@prisma/client';

import { ConflictError } from '../errors/conflict.error';

export async function findByPedidoAndProducto(pedidoId: number, productoId: number) {
  return prisma.ordenProduccion.findFirst({
    where: {
      pedidoId,
      productoId,
    },
  });
}

export async function findEstadoPendiente() {
  return prisma.estadoOrdenProduccion.findUniqueOrThrow({
    where: {
      nombre: 'Pendientes',
    },
  });
}

export async function createOrdenProduccion(data: {
  empresaId: number;
  productoId: number;
  estadoId: number;
  pedidoId: number | undefined;
  responsableId: string;
  cantidad: number;
  prioridad: PrioridadOrden;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const orden = await tx.ordenProduccion.create({
        data: {
          empresaId: data.empresaId,
          productoId: data.productoId,
          estadoId: data.estadoId,
          pedidoId: data.pedidoId ?? null,
          responsableId: data.responsableId,
          cantidad: data.cantidad,
          prioridad: data.prioridad,
        },
        include: {
          producto: true,
          estado: true,
          pedido: true,
        },
      });

      await tx.historialEstadoOrdenProduccion.create({
        data: {
          ordenId: orden.idOrden,
          estadoId: data.estadoId,
          usuarioId: data.responsableId,
        },
      });

      return orden;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('Ya existe una orden de producción para este producto del pedido.');
    }

    throw error;
  }
}
