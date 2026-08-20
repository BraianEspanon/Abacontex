import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearPedido } from '../api/pedido.api';

export const useCrearPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPedido,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });
    },
  });
};
