import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registrarAsiento } from '../api/contabilidad.api';

export function useRegistrarAsiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarAsiento,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'pendientes'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'resumen'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'ultimos'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'libro-diario'],
        }),
      ]);
    },
  });
}
