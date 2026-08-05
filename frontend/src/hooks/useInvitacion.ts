import { useQuery } from '@tanstack/react-query';
import { obtenerInvitacion } from '../api/invitacion.api';

export function useInvitacion(enabled = true) {
  return useQuery({
    queryKey: ['invitacion-activa'],
    queryFn: obtenerInvitacion,
    enabled,
  });
}
