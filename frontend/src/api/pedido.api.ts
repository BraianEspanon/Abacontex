import clienteApi from './clienteApi';
import type {
  PedidosQueryParams,
  PedidosResponse,
  PedidoDetalle,
  CrearPedidoPayload,
  EstadoPedido,
} from '../types/pedido.types';

export async function obtenerPedidos(params: PedidosQueryParams = {}): Promise<PedidosResponse> {
  const { data } = await clienteApi.get('/pedidos', { params });
  return data;
}

export async function obtenerPedidoPorId(pedidoId: number): Promise<PedidoDetalle> {
  const { data } = await clienteApi.get(`/pedidos/${pedidoId}`);
  return data;
}

export async function crearPedido(pedido: CrearPedidoPayload): Promise<PedidoDetalle> {
  // Garantizamos compatibilidad con la DTO del backend
  const body = {
    cliente: pedido.cliente,
    fecha: pedido.fecha,
    items: pedido.items,
    detalles: pedido.items,
  };
  const { data } = await clienteApi.post('/pedidos', body);
  return data;
}

export async function actualizarEstadoPedido(
  pedidoId: number,
  estado: EstadoPedido
): Promise<PedidoDetalle> {
  const { data } = await clienteApi.patch(`/pedidos/${pedidoId}/estado`, { estado });
  return data;
}
