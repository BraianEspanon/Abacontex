import { useMutation, useQueryClient } from '@tanstack/react-query';
import clienteApi from '../api/clienteApi';

export function useEliminarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await clienteApi.delete(`/pedidos/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}
