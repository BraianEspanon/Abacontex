import clienteApi from './clienteApi';

import type {
  CrearPedidoRequest,
  KanbanPedidos,
  PedidoCambioEstado,
  PedidoCreado,
  PedidoDetalle,
} from '../types/pedido.types';

/**
 * Registra un nuevo pedido para la empresa del alumno autenticado.
 */
export const crearPedido = async (data: CrearPedidoRequest): Promise<PedidoCreado> => {
  const response = await clienteApi.post<PedidoCreado>('/pedidos', data);

  return response.data;
};

/**
 * Obtiene el tablero Kanban de pedidos de la empresa
 * asociada al usuario autenticado.
 */
export const obtenerPedidos = async (): Promise<KanbanPedidos> => {
  const response = await clienteApi.get<KanbanPedidos>('/pedidos');

  return response.data;
};

/**
 * Obtiene el detalle completo de un pedido.
 */
export const obtenerDetallePedido = async (idPedido: number): Promise<PedidoDetalle> => {
  const response = await clienteApi.get<PedidoDetalle>(`/pedidos/${idPedido}`);

  return response.data;
};

/**
 * Marca un pedido pendiente como listo para entregar.
 */
export const marcarPedidoListoParaEntregar = async (
  idPedido: number
): Promise<PedidoCambioEstado> => {
  const response = await clienteApi.patch<PedidoCambioEstado>(
    `/pedidos/${idPedido}/listo-para-entregar`
  );

  return response.data;
};
