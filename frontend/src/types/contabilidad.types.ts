export type TipoOrigenAsiento =
  | 'VENTA'
  | 'MOVIMIENTO_FINANCIERO'
  | 'CONCILIACION_FINANCIERA'
  | 'AJUSTE';

export type TipoOperacionPendiente = Exclude<TipoOrigenAsiento, 'AJUSTE'>;

export type MovimientoCuentaContable =
  | 'A_MAS'
  | 'A_MENOS'
  | 'P_MAS'
  | 'P_MENOS'
  | 'PN'
  | 'R_MAS'
  | 'R_MENOS';

/* =========================================================
   TIPOS DE MOVIMIENTO
   ========================================================= */

export interface TipoMovimientoAsiento {
  codigo: MovimientoCuentaContable;
  simbolo: string;
  nombre: string;
  columnaSugerida: 'DEBE' | 'HABER';
  descripcion: string;
}

/* =========================================================
   OPERACIONES PENDIENTES
   ========================================================= */

export interface OperacionPendiente {
  id: number;
  tipo: TipoOperacionPendiente;
  fecha: string;
  concepto: string;
  montoTotal: number;
}

export interface OperacionesPendientesResponse {
  items: OperacionPendiente[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OperacionesPendientesParams {
  page?: number;
  pageSize?: number;
}

/* =========================================================
   DETALLE DE OPERACIÓN PENDIENTE
   ========================================================= */

export interface DetallePendienteVentaProducto {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitarioCosto: number;
}

export interface DetallePendienteVenta {
  tipo: 'VENTA';
  idVenta: number;
  pedidoId: number;
  fecha: string;
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
  productos?: DetallePendienteVentaProducto[];
}

export interface DetallePendienteMovimiento {
  tipo: 'MOVIMIENTO_FINANCIERO';
  idMovimiento: number;
  fecha: string;
  tipoMovimiento: string;
  categoria: string;
  concepto: string;
  importe: number;
  medioPago: string;
}

export interface DetallePendienteConciliacion {
  tipo: 'CONCILIACION_FINANCIERA';
  idConciliacion: number;
  fecha: string;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  observacion: string | null;
}

export type DetalleOperacionPendiente =
  | DetallePendienteVenta
  | DetallePendienteMovimiento
  | DetallePendienteConciliacion;

/* =========================================================
   CUENTAS Y FOLIOS
   ========================================================= */

export interface CuentaContableConFolio {
  idCuenta: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  numeroFolio: number | null;
}

export interface CuentasConFolioResponse {
  proximoFolioDisponible: number;
  cuentas: CuentaContableConFolio[];
}

/* =========================================================
   REGISTRAR ASIENTO
   ========================================================= */

export interface RegistrarAsientoDetalleRequest {
  cuentaId: number;
  movimiento: MovimientoCuentaContable;
  debe: number;
  haber: number;
}

export interface RegistrarAsientoRequest {
  tipo: TipoOrigenAsiento;
  operacionId: number;
  conceptoGeneral: string;
  detalles: RegistrarAsientoDetalleRequest[];
}

/* =========================================================
   RESUMEN DEL DASHBOARD
   ========================================================= */

export interface ResumenContabilidad {
  asientosRegistradosCount: number;
  pendientesRegistrarCount: number;
}

/* =========================================================
   ÚLTIMOS ASIENTOS
   ========================================================= */

export interface DetalleAsientoResumen {
  idDetalle: number;
  orden: number;
  cuentaId: number;
  codigoCuenta: string;
  nombreCuenta: string;
  movimiento: MovimientoCuentaContable;
  debe: number;
  haber: number;
}

export interface AsientoResumen {
  idAsiento: number;
  numeroAsiento: number;
  fechaHecho: string;
  fechaAsiento: string;
  conceptoGeneral: string;
  origen: TipoOrigenAsiento;
  totalDebe: number;
  totalHaber: number;
  detalles: DetalleAsientoResumen[];
}

/* =========================================================
   LIBRO DIARIO
   ========================================================= */

export interface RenglonLibroDiario {
  idDetalle: number;
  nombreCuenta: string;
  movimientoAbreviatura: string;
  numeroFolio: number | null;
  debe: number;
  haber: number;
}

export interface AsientoLibroDiario {
  idAsiento: number;
  numeroAsiento: number;
  fechaHecho: string;
  fechaAsiento: string;
  conceptoGeneral: string;
  detalles: RenglonLibroDiario[];
}

export interface LibroDiarioResponse {
  totalDebeGeneral: number;
  totalHaberGeneral: number;
  asientos: AsientoLibroDiario[];
}

/* =========================================================
   EDITAR ASIENTO
   ========================================================= */

export interface RenglonAsientoDetalle {
  idDetalle: number;
  orden: number;
  cuentaId: number;
  codigoCuenta: string;
  nombreCuenta: string;
  movimiento: MovimientoCuentaContable;
  movimientoAbreviatura: string;
  debe: number;
  haber: number;
}

export interface AsientoDetalleEdicion {
  idAsiento: number;
  numeroAsiento: number;
  fechaHecho: string;
  fechaAsiento: string;
  conceptoGeneral: string;
  origen: TipoOrigenAsiento;
  ventaId: number | null;
  movimientoFinancieroId: number | null;
  conciliacionId: number | null;
  operacionId: number | null;
  operacionOrigen: DetalleOperacionPendiente | null;
  detalles: RenglonAsientoDetalle[];
}

export interface EditarAsientoDetalleRequest {
  idDetalle?: number;
  cuentaId: number;
  movimiento: MovimientoCuentaContable;
  debe: number;
  haber: number;
}

export interface EditarAsientoRequest {
  detalles: EditarAsientoDetalleRequest[];
}
export interface RenglonAsientoEdicion {
  idDetalle: number;
  orden: number;
  cuentaId: number;
  codigoCuenta: string;
  nombreCuenta: string;
  movimiento: MovimientoCuentaContable;
  movimientoAbreviatura: string;
  debe: number;
  haber: number;
}

export interface AsientoDetalleEdicion {
  idAsiento: number;
  numeroAsiento: number;
  fechaHecho: string;
  fechaAsiento: string;
  conceptoGeneral: string;
  origen: TipoOrigenAsiento;
  ventaId: number | null;
  movimientoFinancieroId: number | null;
  conciliacionId: number | null;
  operacionId: number | null;
  operacionOrigen: DetalleOperacionPendiente | null;
  detalles: RenglonAsientoEdicion[];
}

export interface EditarAsientoDetalleRequest {
  idDetalle?: number;
  cuentaId: number;
  movimiento: MovimientoCuentaContable;
  debe: number;
  haber: number;
}

export interface EditarAsientoRequest {
  detalles: EditarAsientoDetalleRequest[];
}
