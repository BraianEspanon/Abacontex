import clienteApi from './clienteApi';

import type {
  FacturaDetalle,
  FacturasQueryParams,
  FacturasResponse,
  GenerarFacturaRequest,
  VentasPendientesFacturacionResponse,
  VentasPendientesQueryParams,
} from '../types/facturacion.types';

/**
 * Obtiene el dashboard de facturación junto con
 * el listado paginado de facturas emitidas.
 */
export async function obtenerFacturas(params: FacturasQueryParams = {}): Promise<FacturasResponse> {
  const { data } = await clienteApi.get<FacturasResponse>('/facturas', {
    params,
  });

  return data;
}

export async function obtenerVentasPendientesFacturacion(
  params: VentasPendientesQueryParams = {}
): Promise<VentasPendientesFacturacionResponse> {
  const { data } = await clienteApi.get<VentasPendientesFacturacionResponse>(
    '/facturas/ventas-pendientes',
    {
      params,
    }
  );

  return data;
}

export async function generarFactura(payload: GenerarFacturaRequest): Promise<FacturaDetalle> {
  const { data } = await clienteApi.post<FacturaDetalle>('/facturas', payload);

  return data;
}

export async function obtenerDetalleFactura(idFactura: number): Promise<FacturaDetalle> {
  const { data } = await clienteApi.get<FacturaDetalle>(`/facturas/${idFactura}`);

  return data;
}
