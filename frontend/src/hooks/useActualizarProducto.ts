import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actualizarProducto } from '../api/producto.api';

import type { ActualizarProductoPayload } from '../types/producto.types';

interface ActualizarProductoParams {
  productoId: number;
  producto: ActualizarProductoPayload;
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productoId,
      producto,
    }: ActualizarProductoParams) =>
      actualizarProducto(productoId, producto),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['productos'],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'productos',
            'detalle',
            variables.productoId,
          ],
        }),
      ]);
    },
  });
}