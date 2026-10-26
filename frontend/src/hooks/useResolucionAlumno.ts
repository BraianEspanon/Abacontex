import { useQuery } from '@tanstack/react-query';

import { obtenerResolucionAlumno } from '../api/entrega.api';

export function useResolucionAlumno(idEjercicio: number | undefined) {
  return useQuery({
    queryKey: ['entregas', idEjercicio, 'resolucion'],

    queryFn: () => obtenerResolucionAlumno(idEjercicio!),

    enabled: idEjercicio !== undefined && Number.isInteger(idEjercicio) && idEjercicio > 0,
  });
}
