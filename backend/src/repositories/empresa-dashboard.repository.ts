import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ESTADOS_MOVIMIENTO } from '../constants/estados-movimiento';
import { ESTADOS_PEDIDOS } from '../constants/estados-pedidos';
import { ESTADOS_PRODUCCION } from '../constants/estados-produccion';

export async function findMovimientosFinancierosEmpresa(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.movimientoFinanciero.findMany({
    where: {
      idEmpresa: empresaId,
      estado: {
        nombre: {
          not: ESTADOS_MOVIMIENTO.ANULADO,
        },
      },
    },
    select: {
      fecha: true,
      importe: true,
      categoria: {
        select: {
          tipoMovimiento: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
    orderBy: {
      fecha: 'asc',
    },
  });
}

export async function findActividadPendienteCounts(
  empresaId: number,
  cursoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const [
    pedidosPendientes,
    pedidosListosParaEntregar,
    ordenesProduccionPendientes,
    facturasPendientes,
    ejerciciosSinResolver,
  ] = await Promise.all([
    db.pedido.count({
      where: {
        empresaId,
        estado: { nombre: ESTADOS_PEDIDOS.PENDIENTE },
      },
    }),
    db.pedido.count({
      where: {
        empresaId,
        estado: { nombre: ESTADOS_PEDIDOS.LISTO_PARA_ENTREGAR },
      },
    }),
    db.ordenProduccion.count({
      where: {
        empresaId,
        estado: { nombre: ESTADOS_PRODUCCION.PENDIENTE },
      },
    }),
    db.venta.count({
      where: {
        empresaId,
        factura: null,
      },
    }),
    db.ejercicio.count({
      where: {
        cursoId,
        estado: 'PUBLICADO',
      },
    }),
  ]);

  return {
    pedidosPendientes,
    pedidosListosParaEntregar,
    ordenesProduccionPendientes,
    facturasPendientes,
    ejerciciosSinResolver,
  };
}

export async function findIndicadoresNegocioCounts(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const [
    pedidosRecibidos,
    pedidosEntregados,
    ventasAggregate,
    ordenesTotales,
    ordenesCompletadas,
    pedidosConFaltante,
  ] = await Promise.all([
    db.pedido.count({
      where: { empresaId },
    }),
    db.pedido.count({
      where: {
        empresaId,
        estado: { nombre: ESTADOS_PEDIDOS.COMPLETADO },
      },
    }),
    db.venta.aggregate({
      where: { empresaId },
      _sum: {
        totalFinal: true,
      },
    }),
    db.ordenProduccion.count({
      where: { empresaId },
    }),
    db.ordenProduccion.count({
      where: {
        empresaId,
        estado: { nombre: ESTADOS_PRODUCCION.FINALIZADA },
      },
    }),
    db.pedido.count({
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
    }),
  ]);

  return {
    pedidosRecibidos,
    pedidosEntregados,
    ventasRegistradas: Number(ventasAggregate._sum.totalFinal ?? 0),
    ordenesTotales,
    ordenesCompletadas,
    pedidosConFaltante,
  };
}

export async function findInvitacionesPendientesVigentes(
  empresaId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.invitacionEmpresa.findMany({
    where: {
      empresaId,
      estado: 'PENDIENTE',
      fechaExpiracion: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      fechaExpiracion: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
