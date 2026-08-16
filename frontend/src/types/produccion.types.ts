export type PrioridadOrdenProduccion = 'ALTA' | 'MEDIA' | 'BAJA';

export type EstadoOrdenProduccion = 'PENDIENTE' | 'EN_PRODUCCION' | 'FINALIZADA';

/**
 * Producto faltante de un pedido que todavía puede
 * generar una orden de producción.
 */
export interface FaltantePedidoProduccion {
  productoId: number;
  productoNombre: string;
  cantidadPendiente: number;
}

/**
 * Pedido que puede asociarse a una nueva orden.
 *
 * El backend solamente devuelve faltantes para los cuales
 * todavía no existe una orden de producción.
 */
export interface PedidoAsociableProduccion {
  idPedido: number;
  clienteNombre: string;
  fecha: string;
  faltantes: FaltantePedidoProduccion[];
}

/**
 * Información utilizada por cada tarjeta del tablero.
 */
export interface OrdenProduccionTarjeta {
  idOrden: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  prioridad: PrioridadOrdenProduccion;
  estado: EstadoOrdenProduccion;
  pedidoId: number | null;
  fechaCreacion: string;
}

export interface ResumenProduccion {
  total: number;
  pendientes: number;
  enProceso: number;
  finalizadas: number;
}

/**
 * Respuesta REAL del service obtenerTableroProduccion().
 */
export interface TableroProduccion {
  resumen: ResumenProduccion;

  columnas: {
    pendientes: OrdenProduccionTarjeta[];
    enProceso: OrdenProduccionTarjeta[];
    finalizadas: OrdenProduccionTarjeta[];
  };
}

/**
 * Payload enviado al POST /produccion.
 */
export interface CrearOrdenProduccionRequest {
  productoId: number;
  cantidadProducir: number;
  prioridad: PrioridadOrdenProduccion;
  pedidoId?: number;
}

export interface ProductoDetalleOrdenProduccion {
  id: number;
  nombre: string;
}

export interface PedidoDetalleOrdenProduccion {
  idPedido: number;
}

export interface TiemposOrdenProduccion {
  /**
   * Duraciones expresadas en milisegundos.
   */
  pendiente: number;
  enProduccion: number;
  total: number;
}

export interface ProgresoOrdenProduccion {
  pendiente: boolean;
  enProduccion: boolean;
  finalizada: boolean;
}

export interface HistorialOrdenProduccion {
  estado: EstadoOrdenProduccion;
  fechaInicio: string;
  fechaFin: string | null;

  /**
   * Duración del estado expresada en milisegundos.
   */
  duracion: number;
}

/**
 * Respuesta real generada por mapearDetalleOrden().
 */
export interface DetalleOrdenProduccion {
  idOrden: number;

  producto: ProductoDetalleOrdenProduccion;

  cantidad: number;

  prioridad: PrioridadOrdenProduccion;

  estado: EstadoOrdenProduccion;

  pedido: PedidoDetalleOrdenProduccion | null;

  fechaCreacion: string;

  tiempos: TiemposOrdenProduccion;

  progreso: ProgresoOrdenProduccion;

  historial: HistorialOrdenProduccion[];
}
