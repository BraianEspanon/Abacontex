import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerVentas } from '../api/venta.api';

import type { VentasQueryParams } from '../types/venta.types';

export function useVentas(params: VentasQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['ventas', params],
    queryFn: () => obtenerVentas(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}
