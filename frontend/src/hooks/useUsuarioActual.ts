import { useKeycloak } from '@react-keycloak/web';
import { useQuery } from '@tanstack/react-query';
import { obtenerUsuarioActual } from '../api/usuario.api';

export function useUsuarioActual() {
  const { keycloak, initialized } = useKeycloak();

  return useQuery({
    queryKey: ['usuario-actual'],
    queryFn: obtenerUsuarioActual,
    enabled: initialized && Boolean(keycloak.authenticated),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
