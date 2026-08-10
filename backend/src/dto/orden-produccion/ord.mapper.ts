import { ESTADOS_PRODUCCION } from '../../constants/estados-produccion';
import { $Enums } from '@prisma/client';

function calcularDuracionEstado(fechaInicio: Date, fechaFin: Date | null) {
  const fin = fechaFin ?? new Date();

  return fin.getTime() - fechaInicio.getTime();
}

export function mapearDetalleOrden(orden: {
  idOrden: number;
  cantidad: number;
  prioridad: $Enums.PrioridadOrden;
  createdAt: Date;
  producto: { id: number; nombre: string };
  estado: { nombre: string; idEstado: number };
  pedido: { idPedido: number } | null;
  historialEstados: {
    estadoId: number;
    estado: { nombre: string };
    fechaInicio: Date;
    fechaFin: Date | null;
  }[];
}) {
  let tiempoPendiente = 0;
  let tiempoEnProduccion = 0;

  for (const historial of orden.historialEstados) {
    const duracion = calcularDuracionEstado(historial.fechaInicio, historial.fechaFin);

    if (historial.estado.nombre === ESTADOS_PRODUCCION.PENDIENTE) {
      tiempoPendiente += duracion;
    }

    if (historial.estado.nombre === ESTADOS_PRODUCCION.EN_PRODUCCION) {
      tiempoEnProduccion += duracion;
    }
  }

  const historialFinalizada = orden.historialEstados.find(
    (historial) => historial.estado.nombre === ESTADOS_PRODUCCION.FINALIZADA
  );

  const fechaFinTotal = historialFinalizada?.fechaInicio ?? new Date();

  const tiempoTotal = fechaFinTotal.getTime() - orden.createdAt.getTime();

  return {
    idOrden: orden.idOrden,

    producto: {
      id: orden.producto.id,
      nombre: orden.producto.nombre,
    },

    cantidad: orden.cantidad,

    prioridad: orden.prioridad,

    estado: orden.estado.nombre,

    pedido: orden.pedido
      ? {
          idPedido: orden.pedido.idPedido,
        }
      : null,

    fechaCreacion: orden.createdAt,

    tiempos: {
      pendiente: tiempoPendiente,
      enProduccion: tiempoEnProduccion,
      total: tiempoTotal,
    },

    progreso: {
      pendiente: orden.estado.nombre === ESTADOS_PRODUCCION.PENDIENTE,
      enProduccion: orden.estado.nombre === ESTADOS_PRODUCCION.EN_PRODUCCION,
      finalizada: orden.estado.nombre === ESTADOS_PRODUCCION.FINALIZADA,
    },

    historial: orden.historialEstados.map((historial) => ({
      estado: historial.estado.nombre,
      fechaInicio: historial.fechaInicio,
      fechaFin: historial.fechaFin,
      duracion: calcularDuracionEstado(historial.fechaInicio, historial.fechaFin),
    })),
  };
}
