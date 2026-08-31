import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registrarConciliacion } from '../api/finanzas.api';

export function useRegistrarConciliacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarConciliacion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['finanzas', 'conciliacion'],
      });
    },
  });
}
