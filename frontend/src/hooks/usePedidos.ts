import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { obtenerPedidos } from '../api/pedido.api';
import type { PedidosQueryParams } from '../types/pedido.types';

export function usePedidos(params: PedidosQueryParams) {
  return useQuery({
    queryKey: ['pedidos', params],
    queryFn: () => obtenerPedidos(params),
    placeholderData: keepPreviousData,
  });
}