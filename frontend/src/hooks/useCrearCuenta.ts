import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registrarCuenta } from '../api/cuenta.api';

export function useCrearCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarCuenta,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['cuentas'],
      });
    },
  });
}
