import clienteApi from './clienteApi';

import type {
  DetalleVenta,
  PedidoListoVenta,
  RegistrarVentaRequest,
  VentaRegistrada,
  VentasQueryParams,
  VentasResponse,
} from '../types/venta.types';

/**
 * Obtiene las ventas registradas de la empresa
 * junto con los indicadores generales.
 */
export async function obtenerVentas(params: VentasQueryParams = {}): Promise<VentasResponse> {
  const { data } = await clienteApi.get<VentasResponse>('/ventas', {
    params,
  });

  return data;
}

/**
 * Obtiene el detalle completo de una venta.
 */
export async function obtenerDetalleVenta(idVenta: number): Promise<DetalleVenta> {
  const { data } = await clienteApi.get<DetalleVenta>(`/ventas/${idVenta}`);

  return data;
}

/**
 * Obtiene los pedidos que pueden utilizarse
 * para registrar una nueva venta.
 *
 * El backend solamente devuelve pedidos
 * en estado Listo para entregar.
 */
export async function obtenerPedidosListosVenta(): Promise<PedidoListoVenta[]> {
  const { data } = await clienteApi.get<PedidoListoVenta[]>('/ventas/pedidos-listos');

  return data;
}

export async function registrarVenta(payload: RegistrarVentaRequest): Promise<VentaRegistrada> {
  const { data } = await clienteApi.post<VentaRegistrada>('/ventas', payload);

  return data;
}
