import { useQuery } from '@tanstack/react-query';

import { obtenerLibroDiario } from '../api/contabilidad.api';

export function useLibroDiario(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'libro-diario'],
    queryFn: obtenerLibroDiario,
    enabled,
  });
}
