import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registrarMovimientoFinanciero } from '../api/finanzas.api';

export function useRegistrarMovimientoFinanciero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarMovimientoFinanciero,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['finanzas', 'resumen'],
      });

      queryClient.invalidateQueries({
        queryKey: ['finanzas', 'grafico'],
      });

      queryClient.invalidateQueries({
        queryKey: ['finanzas', 'movimientos'],
      });

      /*
       * Cuando implementemos conciliación, también deberá
       * recalcularse porque el saldo esperado puede cambiar.
       */
      queryClient.invalidateQueries({
        queryKey: ['finanzas', 'conciliacion'],
      });
    },
  });
}
