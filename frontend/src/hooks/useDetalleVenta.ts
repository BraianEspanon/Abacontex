import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleVenta } from '../api/venta.api';

export function useDetalleVenta(idVenta: number | null) {
  return useQuery({
    queryKey: ['ventas', 'detalle', idVenta],
    queryFn: () => obtenerDetalleVenta(idVenta as number),
    enabled: idVenta !== null,
  });
}
