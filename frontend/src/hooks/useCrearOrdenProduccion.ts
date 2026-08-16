import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearOrdenProduccion } from '../api/produccion.api';

export function useCrearOrdenProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearOrdenProduccion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });

      queryClient.invalidateQueries({
        queryKey: ['produccion', 'pedidos-asociables'],
      });

      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });
    },
  });
}
