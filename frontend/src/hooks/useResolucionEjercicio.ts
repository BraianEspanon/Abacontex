import { useQuery } from '@tanstack/react-query';

import { obtenerResolucionDocente } from '../api/ejercicio.api';

export function useResolucionEjercicio(idEjercicio: number | undefined) {
  return useQuery({
    queryKey: ['ejercicios', idEjercicio, 'resolucion'],
    queryFn: () => obtenerResolucionDocente(idEjercicio!),
    enabled: idEjercicio !== undefined && Number.isInteger(idEjercicio) && idEjercicio > 0,
  });
}
