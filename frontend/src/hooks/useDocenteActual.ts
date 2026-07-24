import { useKeycloak } from '@react-keycloak/web';
import { useQuery } from '@tanstack/react-query';
import { obtenerDocenteActual } from '../api/docente.api';

export function useDocenteActual() {
  const { keycloak, initialized } = useKeycloak();

  return useQuery({
    queryKey: ['docente-actual'],
    queryFn: obtenerDocenteActual,
    enabled: initialized && Boolean(keycloak.authenticated),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}