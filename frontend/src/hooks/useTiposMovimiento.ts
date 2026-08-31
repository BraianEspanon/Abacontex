import { useQuery } from '@tanstack/react-query';

import { obtenerTiposMovimiento } from '../api/finanzas.api';

export function useTiposMovimiento() {
  return useQuery({
    queryKey: ['finanzas', 'tipos-movimiento'],
    queryFn: obtenerTiposMovimiento,
  });
}
