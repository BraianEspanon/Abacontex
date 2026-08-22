import { useMutation, useQueryClient } from '@tanstack/react-query';

import { finalizarOrdenProduccion } from '../api/produccion.api';

export function useFinalizarOrdenProduccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizarOrdenProduccion,

    onSuccess: (_, idOrden) => {
      /*
       * Actualiza el tablero de producción.
       */
      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });

      /*
       * Actualiza el detalle de la orden finalizada.
       */
      queryClient.invalidateQueries({
        queryKey: ['produccion', 'detalle', idOrden],
      });

      /*
       * Al finalizar una orden cambia la producción real
       * utilizada por la planificación anual.
       *
       * Esto recalcula:
       * - producido acumulado;
       * - producción real mensual;
       * - cumplimiento mensual;
       * - cumplimiento anual.
       */
      queryClient.invalidateQueries({
        queryKey: ['planificacion'],
      });

      /*
       * La finalización puede afectar el estado del pedido
       * asociado.
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos'],
      });

      /*
       * Al finalizar la orden se actualiza el stock
       * del producto producido.
       */
      queryClient.invalidateQueries({
        queryKey: ['productos'],
      });

      /*
       * Puede dejar de existir un faltante asociable
       * después de completar la producción.
       */
      queryClient.invalidateQueries({
        queryKey: ['produccion', 'pedidos-asociables'],
      });
    },
  });
}
