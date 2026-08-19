import { useMutation, useQueryClient } from '@tanstack/react-query';

import { finalizarOrdenProduccion } from '../api/produccion.api';

export function useFinalizarOrdenProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizarOrdenProduccion,

    onSuccess: (_, idOrden) => {
      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });

      queryClient.invalidateQueries({
        queryKey: ['produccion', 'detalle', idOrden],
      });

      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['productos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['produccion', 'pedidos-asociables'],
      });
    },
  });
}
