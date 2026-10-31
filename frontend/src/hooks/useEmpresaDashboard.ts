import { useQuery } from '@tanstack/react-query';

import { obtenerEmpresaDashboard } from '../api/empresa-dashboard.api';

export function useEmpresaDashboard(enabled = true) {
  return useQuery({
    queryKey: ['empresa-dashboard'],
    queryFn: obtenerEmpresaDashboard,
    enabled,
  });
}
