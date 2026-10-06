import { useQuery } from '@tanstack/react-query';

import { obtenerTiposMovimientoAsiento } from '../api/contabilidad.api';

export function useTiposMovimientoAsiento(enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'tipos-movimiento'],
    queryFn: obtenerTiposMovimientoAsiento,
    enabled,
  });
}
