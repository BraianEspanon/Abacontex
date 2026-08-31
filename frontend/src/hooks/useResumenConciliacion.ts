import { useQuery } from '@tanstack/react-query';

import { obtenerResumenConciliacion } from '../api/finanzas.api';

export function useResumenConciliacion() {
  return useQuery({
    queryKey: ['finanzas', 'conciliacion', 'resumen'],
    queryFn: obtenerResumenConciliacion,
  });
}
