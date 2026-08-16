import { useQuery } from '@tanstack/react-query';

import { obtenerPedidosAsociables } from '../api/produccion.api';

export function usePedidosAsociablesProduccion() {
  return useQuery({
    queryKey: ['produccion', 'pedidos-asociables'],
    queryFn: obtenerPedidosAsociables,
  });
}
