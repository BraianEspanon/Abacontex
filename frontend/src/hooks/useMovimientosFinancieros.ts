import { useQuery } from '@tanstack/react-query';

import { obtenerMovimientosFinancieros } from '../api/finanzas.api';

import type { MovimientosFinancierosQueryParams } from '../types/finanzas.types';

export function useMovimientosFinancieros(params: MovimientosFinancierosQueryParams) {
  return useQuery({
    queryKey: ['finanzas', 'movimientos', params],
    queryFn: () => obtenerMovimientosFinancieros(params),
  });
}
