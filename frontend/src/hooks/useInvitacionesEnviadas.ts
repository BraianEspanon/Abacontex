import { useQuery } from '@tanstack/react-query';

import { obtenerInvitacionesEnviadas } from '../api/invitacion.api';

export function useInvitacionesEnviadas(habilitado = true) {
  return useQuery({
    queryKey: ['empresa', 'invitaciones-enviadas'],
    queryFn: obtenerInvitacionesEnviadas,
    enabled: habilitado,
    staleTime: 30 * 1000,
    retry: false,
  });
}
