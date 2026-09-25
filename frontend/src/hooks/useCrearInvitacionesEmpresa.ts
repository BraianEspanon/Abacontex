import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearInvitacionesEmpresa, type CrearInvitacionesRequest } from '../api/invitacion.api';

export function useCrearInvitacionesEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearInvitacionesRequest) => crearInvitacionesEmpresa(datos),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['empresa', 'invitaciones-enviadas'],
      });
    },
  });
}
