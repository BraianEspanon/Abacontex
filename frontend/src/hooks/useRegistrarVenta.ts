import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registrarVenta } from '../api/venta.api';

export function useRegistrarVenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarVenta,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ventas'],
      });

      queryClient.invalidateQueries({
        queryKey: ['ventas', 'pedidos-listos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['pedido', variables.pedidoId],
      });
    },
  });
}
