import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearProducto } from '../api/producto.api';

import type { CrearProductoPayload } from '../types/producto.types';

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: CrearProductoPayload) =>
      crearProducto(producto),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['productos'],
      });
    },
  });
}