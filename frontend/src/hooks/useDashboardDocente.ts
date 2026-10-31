import { useQuery } from '@tanstack/react-query';

import { obtenerDashboardDocente } from '../api/docente.api';

export function useDashboardDocente() {
  return useQuery({
    queryKey: ['dashboard-docente'],
    queryFn: obtenerDashboardDocente,
    staleTime: 2 * 60 * 1000,
  });
}
