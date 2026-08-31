import { useQuery } from '@tanstack/react-query';

import { obtenerConciliaciones } from '../api/finanzas.api';

import type { ConciliacionesQueryParams } from '../types/finanzas.types';

export function useConciliaciones(params: ConciliacionesQueryParams) {
  return useQuery({
    queryKey: ['finanzas', 'conciliacion', 'historial', params],
    queryFn: () => obtenerConciliaciones(params),
  });
}
