import { useQuery } from '@tanstack/react-query';

import { obtenerUltimosAsientos } from '../api/contabilidad.api';

export function useUltimosAsientos(limit = 5, enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'ultimos', limit],
    queryFn: () => obtenerUltimosAsientos(limit),
    enabled,
  });
}
