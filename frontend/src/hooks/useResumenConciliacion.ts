import { useQuery } from '@tanstack/react-query';

import { obtenerResumenConciliacion } from '../api/finanzas.api';

export function useResumenConciliacion(enabled = true) {
  return useQuery({
    queryKey: ['finanzas', 'conciliacion', 'resumen'],
    queryFn: obtenerResumenConciliacion,
    enabled,
  });
}
