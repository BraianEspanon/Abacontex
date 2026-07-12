import { useKeycloak } from '@react-keycloak/web';
import { useQuery } from '@tanstack/react-query';
import { sincronizarUsuarioActual } from '../api/usuario.api';

export function useUsuarioActual() {
  const { keycloak, initialized } = useKeycloak();

  return useQuery({
    queryKey: ['usuario-actual'],
    queryFn: sincronizarUsuarioActual,
    enabled: initialized && Boolean(keycloak.authenticated),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}