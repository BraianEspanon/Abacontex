import { prisma } from '../lib/prisma';
import { Prisma, PrioridadOrden } from '@prisma/client';
import { ESTADOS_PRODUCCION } from '../constants/estados-produccion';

import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';

export async function findOrdenByIdAndEmpresa(idOrden: number, empresaId: number) {
  return prisma.ordenProduccion.findUnique({
    where: {
      idOrden,
      empresaId,
    },
    include: {
      estado: true,
    },
  });
}

export async function findOrdenByIdAndEmpresaOrThrow(idOrden: number, empresaId: number) {
  const orden = await findOrdenByIdAndEmpresa(idOrden, empresaId);

  if (!orden) {
    throw new NotFoundError('No se encontró la orden de producción.', { idOrden, empresaId });
  }

  return orden;
}

export async function findByPedidoAndProducto(pedidoId: number, productoId: number) {
  return prisma.ordenProduccion.findFirst({
    where: {
      pedidoId,
      productoId,
    },
  });
}

export async function findPedidosAsociables(empresaId: number) {
  return prisma.pedido.findMany({
    where: {
      empresaId,
      detalles: {
        some: {
          cantidadPendiente: {
            gt: 0,
          },
        },
      },
    },
    select: {
      idPedido: true,
      clienteNombre: true,
      fecha: true,

      detalles: {
        where: {
          cantidadPendiente: {
            gt: 0,
          },
        },
        select: {
          productoId: true,
          cantidadPendiente: true,
          producto: {
            select: {
              nombre: true,
            },
          },
        },
      },

      ordenesProduccion: {
        select: {
          productoId: true,
        },
      },
    },
    orderBy: {
      fecha: 'desc',
    },
  });
}

export async function findOrdenesParaTablero(empresaId: number) {
  return prisma.ordenProduccion.findMany({
    where: {
      empresaId,
    },
    select: {
      idOrden: true,
      cantidad: true,
      prioridad: true,
      createdAt: true,

      producto: {
        select: {
          id: true,
          nombre: true,
        },
      },

      estado: {
        select: {
          idEstado: true,
          nombre: true,
        },
      },

      pedido: {
        select: {
          idPedido: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function findEstadoPendiente() {
  return prisma.estadoOrdenProduccion.findUniqueOrThrow({
    where: {
      nombre: ESTADOS_PRODUCCION.PENDIENTE,
    },
  });
}

export async function findEstadoEnProduccion() {
  return prisma.estadoOrdenProduccion.findUniqueOrThrow({
    where: {
      nombre: ESTADOS_PRODUCCION.EN_PRODUCCION,
    },
  });
}

export async function findEstadoFinalizada() {
  return prisma.estadoOrdenProduccion.findUniqueOrThrow({
    where: {
      nombre: ESTADOS_PRODUCCION.FINALIZADA,
    },
  });
}

export async function crearHistorialEstado(
  tx: Prisma.TransactionClient,
  ordenId: number,
  estadoId: number,
  usuarioId: string,
  fechaInicio: Date
) {
  return tx.historialEstadoOrdenProduccion.create({
    data: {
      ordenId,
      estadoId,
      usuarioId,
      fechaInicio,
    },
  });
}

export async function cerrarHistorialEstado(
  tx: Prisma.TransactionClient,
  ordenId: number,
  estadoId: number,
  fechaFin: Date
) {
  return tx.historialEstadoOrdenProduccion.updateMany({
    where: {
      ordenId,
      estadoId,
      fechaFin: null,
    },
    data: {
      fechaFin,
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

export async function iniciarOrdenProduccion(
  idOrden: number,
  estadoPendienteId: number,
  estadoEnProduccionId: number,
  usuarioId: string
) {
  return prisma.$transaction(async (tx) => {
    const ahora = new Date();

    // Cierra el período correspondiente al estado Pendiente.
    await tx.historialEstadoOrdenProduccion.updateMany({
      where: {
        ordenId: idOrden,
        estadoId: estadoPendienteId,
        fechaFin: null,
      },
      data: {
        fechaFin: ahora,
      },
    });

    // Actualiza la orden al estado En Producción.
    const orden = await tx.ordenProduccion.update({
      where: {
        idOrden,
      },
      data: {
        estadoId: estadoEnProduccionId,
      },
      include: {
        producto: true,
        estado: true,
        pedido: true,
      },
    });

    // Registra el inicio del nuevo estado.
    await tx.historialEstadoOrdenProduccion.create({
      data: {
        ordenId: idOrden,
        estadoId: estadoEnProduccionId,
        usuarioId,
        fechaInicio: ahora,
      },
    });

    return orden;
  });
}

export async function finalizarOrden(
  tx: Prisma.TransactionClient,
  ordenId: number,
  estadoFinalizadaId: number
) {
  return tx.ordenProduccion.update({
    where: {
      idOrden: ordenId,
    },
    data: {
      estadoId: estadoFinalizadaId,
    },
    include: {
      producto: true,
      estado: true,
      pedido: true,
    },
  });
}
