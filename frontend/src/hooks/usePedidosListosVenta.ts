import { useQuery } from '@tanstack/react-query';

import { obtenerPedidosListosVenta } from '../api/venta.api';

export function usePedidosListosVenta() {
  return useQuery({
    queryKey: ['ventas', 'pedidos-listos'],
    queryFn: obtenerPedidosListosVenta,
  });
}
