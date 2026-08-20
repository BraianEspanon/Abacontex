import { useMutation, useQueryClient } from '@tanstack/react-query';

import { marcarPedidoListoParaEntregar } from '../api/pedido.api';

export const useMarcarPedidoListo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marcarPedidoListoParaEntregar,

    onSuccess: (_, idPedido) => {
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['pedido', idPedido],
      });
    },
  });
};
