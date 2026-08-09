import { prisma } from '../lib/prisma';
import { PrioridadOrden } from '@prisma/client';

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
  return prisma.$transaction(async (tx) => {
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
}
