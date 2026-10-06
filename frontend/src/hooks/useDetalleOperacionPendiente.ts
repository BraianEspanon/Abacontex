import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleOperacionPendiente } from '../api/contabilidad.api';

import type { TipoOperacionPendiente } from '../types/contabilidad.types';

export function useDetalleOperacionPendiente(
  tipo: TipoOperacionPendiente | undefined,
  id: number | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ['contabilidad', 'operacion-pendiente', tipo, id],
    queryFn: () => obtenerDetalleOperacionPendiente(tipo!, id!),
    enabled: enabled && tipo !== undefined && id !== undefined && id > 0,
  });
}
