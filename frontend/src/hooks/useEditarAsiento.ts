import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editarAsiento } from '../api/contabilidad.api';

import type { EditarAsientoRequest } from '../types/contabilidad.types';

interface EditarAsientoVariables {
  idAsiento: number;
  payload: EditarAsientoRequest;
}

export function useEditarAsiento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idAsiento, payload }: EditarAsientoVariables) =>
      editarAsiento(idAsiento, payload),

    onSuccess: async (asientoActualizado) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'libro-diario'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'ultimos'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['contabilidad', 'asiento', asientoActualizado.idAsiento],
        }),
      ]);
    },
  });
}
