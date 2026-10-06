import { useQuery } from '@tanstack/react-query';

import { obtenerCuentasContablesConFolio } from '../api/contabilidad.api';

export function useCuentasContablesConFolio(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'cuentas-con-folio'],
    queryFn: obtenerCuentasContablesConFolio,
    enabled,
  });
}
