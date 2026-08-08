import { useQuery } from '@tanstack/react-query';
import { obtenerPedidoPorId } from '../api/pedido.api';

export function usePedidoDetalle(pedidoId: number | null) {
  return useQuery({
    queryKey: ['pedidos', 'detalle', pedidoId],
    queryFn: () => obtenerPedidoPorId(pedidoId as number),
    enabled: pedidoId !== null, // Solo se ejecuta si hay un ID (ej. al abrir el modal)
  });
}
