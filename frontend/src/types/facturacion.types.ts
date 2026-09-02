export type TipoFactura = 'A' | 'B';

export interface ResumenFacturacion {
  facturasEmitidas: number;
  ventasPendientes: number;
  facturacionMes: number;
  montoFacturado: number;
}

export interface FacturaListado {
  idFactura: number;
  idVenta: number;
  cliente: string;
  condicionFiscal: string;
  fecha: string;
  tipoFactura: TipoFactura;
  montoTotal: number;
}

export interface FacturasResponse {
  resumen: ResumenFacturacion;
  items: FacturaListado[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FacturasQueryParams {
  search?: string;
  tipoFactura?: TipoFactura;
  mes?: number;
  page?: number;
  pageSize?: number;
}

export interface VentaPendienteFacturacion {
  idVenta: number;
  cliente: string;
  montoTotal: number;
}

export interface VentasPendientesFacturacionResponse {
  items: VentaPendienteFacturacion[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface VentasPendientesQueryParams {
  page?: number;
  pageSize?: number;
}

export type CondicionFiscal = 'RESPONSABLE_INSCRIPTO' | 'CONSUMIDOR_FINAL';

export interface GenerarFacturaRequest {
  ventaId: number;
  tipoFactura: TipoFactura;
  condicionFiscal: CondicionFiscal;
}

export interface DetalleFacturaItem {
  cantidad: number;
  detalle: string;
  precioUnitario: number;
  importe: number;
}

export interface TotalesFactura {
  netoGravado: number;
  tipoAjuste: string;
  porcentajeAjuste: number;
  importeAjuste: number;
  porcentajeInteres: number;
  importeInteres: number;
  porcentajeIva: number;
  importeIva: number;
  totalFinal: number;
}

export interface FacturaDetalle {
  idFactura: number;
  tipoFactura: TipoFactura;
  fechaEmision: string;
  cai: string;
  fechaVencimiento: string;

  empresa: {
    nombre: string;
    fechaCreacion: string;
  };

  cliente: {
    nombre: string;
    email: string;
    condicionFiscal: string;
    localidad: string;
  };

  condicionVenta: string;

  detalles: DetalleFacturaItem[];

  totales: TotalesFactura;
}
