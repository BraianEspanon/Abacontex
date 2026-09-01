export interface OperacionPendienteItemDTO {
  id: number;
  tipo: 'VENTA' | 'MOVIMIENTO_FINANCIERO' | 'CONCILIACION_FINANCIERA';
  fecha: Date;
  concepto: string;
  montoTotal: number;
}

export interface DetallePendienteVentaProductoDTO {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitarioCosto: number;
}

export interface DetallePendienteVentaDTO {
  tipo: 'VENTA';
  idVenta: number;
  pedidoId: number;
  fecha: Date;
  estado: string;
  clienteNombre: string;
  clienteMail: string;
  formaPago: string;
  aplicaAjuste: boolean;
  tipoAjuste: string;
  porcentajeAjuste: number;
  importeAjuste: number;
  aplicaIva: boolean;
  importeIva: number;
  cantidadCuotas: number | null;
  porcentajeInteres: number;
  importeInteres: number;
  subtotal: number;
  totalFinal: number;
  productos?: DetallePendienteVentaProductoDTO[];
}

export interface DetallePendienteMovimientoDTO {
  tipo: 'MOVIMIENTO_FINANCIERO';
  idMovimiento: number;
  fecha: Date;
  tipoMovimiento: string;
  categoria: string;
  concepto: string;
  importe: number;
  medioPago: string;
}

export interface DetallePendienteConciliacionDTO {
  tipo: 'CONCILIACION_FINANCIERA';
  idConciliacion: number;
  fecha: Date;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  observacion: string | null;
}

export type DetallePendienteResponseDTO =
  | DetallePendienteVentaDTO
  | DetallePendienteMovimientoDTO
  | DetallePendienteConciliacionDTO;

export interface CuentaConFolioItemDTO {
  idCuenta: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  numeroFolio: number | null;
}

export interface CuentasConFolioResponseDTO {
  proximoFolioDisponible: number;
  cuentas: CuentaConFolioItemDTO[];
}

export interface DetalleAsientoItemDTO {
  idDetalle: number;
  orden: number;
  cuentaId: number;
  codigoCuenta: string;
  nombreCuenta: string;
  movimiento: string;
  debe: number;
  haber: number;
}

export interface AsientoResumenItemDTO {
  idAsiento: number;
  numeroAsiento: number;
  fecha: Date;
  conceptoGeneral: string;
  origen: string;
  totalDebe: number;
  totalHaber: number;
  detalles: DetalleAsientoItemDTO[];
}
