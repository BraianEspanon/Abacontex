import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearPlanificacionAnual } from '../api/planificacion.api';

export function useCrearPlanificacionAnual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPlanificacionAnual,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['planificacion'],
      });

      /*
       * También invalidamos producción porque el dashboard
       * de Producción va a incorporar información derivada
       * de la planificación anual.
       */
      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });
    },
  });
}
