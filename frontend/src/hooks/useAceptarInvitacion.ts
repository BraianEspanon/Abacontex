import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aceptarInvitacion } from '../api/invitacion.api';

export function useAceptarInvitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aceptarInvitacion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['invitacion-activa'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['datos-registro'],
      });
    },
  });
}
