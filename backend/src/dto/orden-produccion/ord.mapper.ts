import { ESTADOS_PRODUCCION } from '../../constants/estados-produccion';
import { $Enums } from '@prisma/client';

export function mapearPedidoAsociable(pedido: {
  idPedido: number;
  clienteNombre: string;
  fecha: Date;
  detalles: { productoId: number; producto: { nombre: string }; cantidadPendiente: number }[];
  ordenesProduccion: { productoId: number }[];
}) {
  // Obtiene los IDs de los productos que ya tienen una orden de producción asociada al pedido.
  const productosConOrden = new Set(pedido.ordenesProduccion.map((orden) => orden.productoId));

  // Filtra los productos que tienen faltante de stock y que todavía no poseen una orden de producción.
  const faltantesAsociables = pedido.detalles.filter(
    (detalle) => !productosConOrden.has(detalle.productoId)
  );

  // Construye la respuesta del pedido incluyendo únicamente los faltantes que pueden asociarse a una nueva orden.
  return {
    idPedido: pedido.idPedido,
    clienteNombre: pedido.clienteNombre,
    fecha: pedido.fecha,
    faltantes: faltantesAsociables.map((detalle) => ({
      productoId: detalle.productoId,
      productoNombre: detalle.producto.nombre,
      cantidadPendiente: detalle.cantidadPendiente,
    })),
  };
}

export function mapearOrdenTablero(orden: {
  idOrden: number;
  cantidad: number;
  prioridad: $Enums.PrioridadOrden;
  createdAt: Date;
  producto: { id: number; nombre: string };
  estado: { nombre: string; idEstado: number };
  pedido: { idPedido: number } | null;
}) {
  return {
    idOrden: orden.idOrden,
    productoId: orden.producto.id,
    productoNombre: orden.producto.nombre,
    cantidad: orden.cantidad,
    prioridad: orden.prioridad,
    estado: orden.estado.nombre,
    pedidoId: orden.pedido?.idPedido ?? null,
    fechaCreacion: orden.createdAt,
  };
}

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
