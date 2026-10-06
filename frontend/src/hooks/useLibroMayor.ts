import { useQuery } from '@tanstack/react-query';

import { obtenerLibroMayor } from '../api/contabilidad.api';

export function useLibroMayor(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'libro-mayor'],
    queryFn: obtenerLibroMayor,
    enabled,
  });
}
