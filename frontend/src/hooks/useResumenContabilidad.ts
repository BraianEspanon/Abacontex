import { useQuery } from '@tanstack/react-query';

import { obtenerResumenContabilidad } from '../api/contabilidad.api';

export function useResumenContabilidad(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'resumen'],
    queryFn: obtenerResumenContabilidad,
    enabled,
  });
}
