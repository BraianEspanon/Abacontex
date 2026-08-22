import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actualizarPlanificacionMensual } from '../api/planificacion.api';

import type { ActualizarPlanificacionMensualRequest } from '../types/planificacion.types';

interface ActualizarPlanificacionMensualVariables {
  idDetalle: number;
  payload: ActualizarPlanificacionMensualRequest;
}

export function useActualizarPlanificacionMensual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idDetalle, payload }: ActualizarPlanificacionMensualVariables) =>
      actualizarPlanificacionMensual(idDetalle, payload),

    onSuccess: () => {
      /*
       * El GET /planificacion recalcula:
       * - estimación anual;
       * - producción acumulada;
       * - cumplimiento anual;
       * - cumplimiento mensual.
       *
       * Por eso no actualizamos manualmente el cache.
       */
      queryClient.invalidateQueries({
        queryKey: ['planificacion'],
      });

      queryClient.invalidateQueries({
        queryKey: ['produccion'],
      });
    },
  });
}
