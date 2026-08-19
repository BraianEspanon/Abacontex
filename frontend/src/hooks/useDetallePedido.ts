import { useQuery } from '@tanstack/react-query';

import { obtenerDetallePedido } from '../api/pedido.api';

export const useDetallePedido = (idPedido: number | null) => {
  return useQuery({
    queryKey: ['pedido', idPedido],
    queryFn: () => obtenerDetallePedido(idPedido as number),
    enabled: idPedido !== null,
  });
};
