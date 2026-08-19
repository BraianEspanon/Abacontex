export type TipoAjusteVenta = 'NINGUNO' | 'DESCUENTO' | 'RECARGO';

export type CantidadCuotasVenta = 2 | 3 | 4 | 6 | 9 | 12 | 18 | 24;

export interface ResumenVentas {
  ventasRegistradas: number;
  totalVendido: number;
  ventasMes: number;
  promedioVenta: number;
}

export interface VentaListado {
  idVenta: number;
  pedidoId: number;
  cliente: string;
  metodoPago: string;
  metodoPagoId: number;
  montoTotal: number;
  fecha: string;
  estado: string;
}

export interface VentasQueryParams {
  search?: string;
  metodoPagoId?: number;
  mes?: number;
}

export interface VentasResponse {
  resumen: ResumenVentas;
  items: VentaListado[];
}

/**
 * Información del producto incluida dentro de un
 * detalle de pedido disponible para registrar una venta.
 *
 * Los importes llegan como string porque en backend
 * corresponden a campos Decimal de Prisma.
 */
export interface ProductoPedidoListoVenta {
  id: number;
  nombre: string;
  precioVenta: string;
  precioConsumidorFinal: string;
}

/**
 * Detalle real devuelto por GET /ventas/pedidos-listos.
 */
export interface DetallePedidoListoVenta {
  idDetallePedido: number;
  pedidoId: number;
  productoId: number;

  cantidad: number;
  cantidadConStock: number;
  cantidadPendiente: number;

  precioUnitario: string;
  subtotal: string;

  precioUnitarioConIva: string;
  subtotalConIva: string;

  producto: ProductoPedidoListoVenta;
}

/**
 * Pedido en estado Listo para entregar
 * que todavía puede asociarse a una venta.
 */
export interface PedidoListoVenta {
  idPedido: number;

  empresaId: number;
  usuarioId: string;
  estadoId: number;

  clienteNombre: string;
  clienteMail: string;

  fecha: string;

  montoTotal: string;
  montoTotalConIva: string;

  createdAt: string;
  updatedAt: string;

  detalles: DetallePedidoListoVenta[];
}

export interface RegistrarVentaRequest {
  pedidoId: number;
  metodoPagoId: number;

  cantidadCuotas: CantidadCuotasVenta | null;

  tipoAjuste: TipoAjusteVenta;
  porcentajeAjuste: number;

  aplicaIva: boolean;

  porcentajeInteres: number;
}

export interface VentaRegistrada {
  idVenta: number;
  empresaId: number;
  pedidoId: number;
  usuarioId: string;
  metodoPagoId: number;

  subtotal: number;

  tipoAjuste: TipoAjusteVenta;
  porcentajeAjuste: number;
  importeAjuste: number;

  aplicaIva: boolean;
  importeIva: number;

  cantidadCuotas: number | null;

  porcentajeInteres: number;
  importeInteres: number;

  totalFinal: number;

  fecha: string;
  estado: string;

  clienteNombre: string;
}

export interface CondicionesComercialesVenta {
  formaPago: string;

  tipoAjuste: TipoAjusteVenta;
  porcentajeAjuste: number;
  importeAjuste: number;

  aplicaIva: boolean;

  cantidadCuotas: number | null;

  porcentajeInteres: number;
  importeInteres: number;
}

export interface TotalesVenta {
  subtotal: number;
  importeIva: number;
  totalFinal: number;
}

export interface DetalleProductoVenta {
  idDetalleVenta: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DetalleVenta {
  idVenta: number;
  pedidoId: number;
  fecha: string;
  estado: string;

  cliente: {
    nombre: string;
    email: string;
  };

  condicionesComerciales: CondicionesComercialesVenta;

  totales: TotalesVenta;

  detalles: DetalleProductoVenta[];
}

export interface MetodoPago {
  idMetodoPago: number;
  nombre: string;
}
