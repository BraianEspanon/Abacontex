import { useMutation, useQueryClient } from '@tanstack/react-query';

import { iniciarOrdenProduccion } from '../api/produccion.api';

export function useIniciarOrdenProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: iniciarOrdenProduccion,

    onSuccess: (_, idOrden) => {
      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });

      queryClient.invalidateQueries({
        queryKey: ['produccion', 'detalle', idOrden],
      });
    },
  });
}
