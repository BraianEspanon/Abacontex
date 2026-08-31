import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerCuentas } from '../api/cuenta.api';

import type { CuentasQueryParams } from '../types/cuenta.types';

export function useCuentas(params: CuentasQueryParams = {}) {
  return useQuery({
    queryKey: ['cuentas', params],
    queryFn: () => obtenerCuentas(params),
    placeholderData: keepPreviousData,
  });
}
