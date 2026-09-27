import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerOperacionesPendientes } from '../api/contabilidad.api';

import type { OperacionesPendientesParams } from '../types/contabilidad.types';

export function useOperacionesPendientes(params: OperacionesPendientesParams, enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'pendientes', params],
    queryFn: () => obtenerOperacionesPendientes(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}
