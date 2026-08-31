import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editarCuenta } from '../api/cuenta.api';

import type { EditarCuentaRequest } from '../types/cuenta.types';

interface ActualizarCuentaVariables {
  idCuenta: number;
  datos: EditarCuentaRequest;
}

export function useActualizarCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idCuenta, datos }: ActualizarCuentaVariables) => editarCuenta(idCuenta, datos),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['cuentas'],
      });
    },
  });
}
