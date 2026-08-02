import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rechazarInvitacion } from '../api/invitacion.api';

export function useRechazarInvitacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rechazarInvitacion,
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
