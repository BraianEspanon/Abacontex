import { useQuery } from '@tanstack/react-query';

import { obtenerPedidos } from '../api/pedido.api';

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: obtenerPedidos,
  });
};
