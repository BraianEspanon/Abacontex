import { useQuery } from '@tanstack/react-query';

import { obtenerCategoriasFinancieras } from '../api/finanzas.api';

export function useCategoriasFinancieras(enabled = true) {
  return useQuery({
    queryKey: ['finanzas', 'categorias'],
    queryFn: obtenerCategoriasFinancieras,
    enabled,
  });
}
