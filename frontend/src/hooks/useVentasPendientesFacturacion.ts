import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerVentasPendientesFacturacion } from '../api/facturacion.api';

import type { VentasPendientesQueryParams } from '../types/facturacion.types';

export function useVentasPendientesFacturacion(
  params: VentasPendientesQueryParams = {},
  enabled = true
) {
  return useQuery({
    queryKey: ['ventas-pendientes-facturacion', params],
    queryFn: () => obtenerVentasPendientesFacturacion(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}
