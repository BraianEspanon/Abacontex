import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleFactura } from '../api/facturacion.api';

export function useDetalleFactura(idFactura: number | null, enabled = true) {
  return useQuery({
    queryKey: ['facturas', 'detalle', idFactura],
    queryFn: () => obtenerDetalleFactura(idFactura as number),
    enabled: enabled && idFactura !== null,
  });
}
