import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerFacturas } from '../api/facturacion.api';

import type { FacturasQueryParams } from '../types/facturacion.types';

export function useFacturas(params: FacturasQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['facturas', params],
    queryFn: () => obtenerFacturas(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}
