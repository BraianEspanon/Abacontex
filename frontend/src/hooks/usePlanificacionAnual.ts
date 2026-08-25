import { useQuery } from '@tanstack/react-query';

import { obtenerPlanificacionAnual } from '../api/planificacion.api';

export function usePlanificacionAnual() {
  return useQuery({
    queryKey: ['planificacion'],
    queryFn: obtenerPlanificacionAnual,
  });
}
