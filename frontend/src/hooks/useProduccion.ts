import { useQuery } from '@tanstack/react-query';

import { obtenerTableroProduccion } from '../api/produccion.api';

export function useProduccion(enabled = true) {
  return useQuery({
    queryKey: ['produccion'],
    queryFn: obtenerTableroProduccion,
    enabled,
  });
}
