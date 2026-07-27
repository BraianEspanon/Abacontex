import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actualizarUsuarioActual } from '../api/usuario.api';

export function useActualizarUsuarioActual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarUsuarioActual,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['usuario-actual'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['docente-actual'],
        }),
      ]);
    },
  });
}
