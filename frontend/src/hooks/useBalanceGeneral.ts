import { useQuery } from '@tanstack/react-query';

import { obtenerBalanceGeneral } from '../api/contabilidad.api';

export function useBalanceGeneral(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'balance-general'],
    queryFn: obtenerBalanceGeneral,
    enabled,
  });
}
