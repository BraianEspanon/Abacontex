import { useMutation, useQueryClient } from '@tanstack/react-query';

import { eliminarProducto } from '../api/producto.api';

export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productoId: number) =>
      eliminarProducto(productoId),

    onSuccess: async (_, productoId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['productos'],
        }),

        queryClient.removeQueries({
          queryKey: ['productos', 'detalle', productoId],
        }),
      ]);
    },
  });
}