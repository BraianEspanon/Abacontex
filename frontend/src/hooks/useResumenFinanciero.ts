import { useQuery } from '@tanstack/react-query';

import { obtenerResumenFinanciero } from '../api/finanzas.api';

export function useResumenFinanciero(enabled = true) {
  return useQuery({
    queryKey: ['finanzas', 'resumen'],
    queryFn: obtenerResumenFinanciero,
    enabled,
  });
}
