import { useQuery } from '@tanstack/react-query';

import { obtenerPedidosListosVenta } from '../api/venta.api';

export function usePedidosListosVenta(enabled = true) {
  return useQuery({
    queryKey: ['ventas', 'pedidos-listos'],
    queryFn: obtenerPedidosListosVenta,
    enabled,
  });
}
