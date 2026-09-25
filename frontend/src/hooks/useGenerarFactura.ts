import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generarFactura } from '../api/facturacion.api';

export function useGenerarFactura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generarFactura,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['facturas'],
      });

      queryClient.invalidateQueries({
        queryKey: ['ventas-pendientes-facturacion'],
      });
    },
  });
}
