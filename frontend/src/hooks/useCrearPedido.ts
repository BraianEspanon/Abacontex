import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearPedido } from '../api/pedido.api';
import type { CrearPedidoPayload } from '../types/pedido.types';

export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevoPedido: CrearPedidoPayload) => crearPedido(nuevoPedido),
    onSuccess: () => {
      // Invalida la lista en caché para que el Kanban se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}
