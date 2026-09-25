import { useQuery } from '@tanstack/react-query';

import { obtenerTiposCuenta } from '../api/cuenta.api';

export function useTiposCuenta() {
  return useQuery({
    queryKey: ['cuentas', 'tipos'],
    queryFn: obtenerTiposCuenta,
    staleTime: 5 * 60 * 1000,
  });
}
