import { useMutation, useQueryClient } from '@tanstack/react-query';

import { responderDecisionSimulacion } from '../api/simulacion.api';

interface ResponderDecisionParams {
  idSimulacionEmpresa: number;
  idOpcion: number;
}

export function useResponderDecisionSimulacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idSimulacionEmpresa, idOpcion }: ResponderDecisionParams) =>
      responderDecisionSimulacion(idSimulacionEmpresa, idOpcion),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['simulaciones', 'conversacion', variables.idSimulacionEmpresa],
      });

      await queryClient.invalidateQueries({
        queryKey: ['simulaciones', 'alumno'],
      });
    },
  });
}
