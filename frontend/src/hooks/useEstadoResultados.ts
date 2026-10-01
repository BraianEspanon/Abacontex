import { useQuery } from '@tanstack/react-query';

import { obtenerEstadoResultados } from '../api/contabilidad.api';

export function useEstadoResultados(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'estado-resultados'],
    queryFn: obtenerEstadoResultados,
    enabled,
  });
}
