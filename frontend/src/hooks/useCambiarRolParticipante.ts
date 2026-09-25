import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cambiarRolParticipante, type CambiarRolParticipanteRequest } from '../api/empresa.api';

interface CambiarRolParticipanteParams {
  idAlumno: string;
  datos: CambiarRolParticipanteRequest;
}

export function useCambiarRolParticipante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idAlumno, datos }: CambiarRolParticipanteParams) =>
      cambiarRolParticipante(idAlumno, datos),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['empresa-actual'],
      });
    },
  });
}
