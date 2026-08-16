import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleOrdenProduccion } from '../api/produccion.api';

export function useDetalleOrdenProduccion(idOrden: number | null) {
  return useQuery({
    queryKey: ['produccion', 'detalle', idOrden],
    queryFn: () => obtenerDetalleOrdenProduccion(idOrden as number),
    enabled: idOrden !== null,
  });
}
