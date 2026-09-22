import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agregarParticipantesEmpresa, type AgregarParticipantesRequest } from '../api/empresa.api';

export function useAgregarParticipantesEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: AgregarParticipantesRequest) => agregarParticipantesEmpresa(datos),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['empresa-actual'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['empresas', 'candidatos'],
        }),
      ]);
    },
  });
}
