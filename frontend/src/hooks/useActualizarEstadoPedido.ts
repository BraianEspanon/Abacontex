import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actualizarEstadoPedido } from '../api/pedido.api';
import type { EstadoPedido } from '../types/pedido.types';

interface ActualizarEstadoParams {
  id: number;
  estado: EstadoPedido;
}

export function useActualizarEstadoPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: ActualizarEstadoParams) => actualizarEstadoPedido(id, estado),
    onSuccess: () => {
      // Recargamos la tabla principal y el detalle si estaba abierto
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}