import { useQuery } from '@tanstack/react-query';

import { obtenerProductoPorId } from '../api/producto.api';

export function useProductoDetalle(productoId: number | null) {
  return useQuery({
    queryKey: ['productos', 'detalle', productoId],
    queryFn: () => obtenerProductoPorId(productoId as number),
    enabled: productoId !== null,
  });
}
