import { useQuery } from '@tanstack/react-query';

import { obtenerCorreccionAlumno } from '../api/entrega.api';

export function useCorreccionAlumno(idEjercicio: number) {
  return useQuery({
    queryKey: ['correccion-alumno', idEjercicio],
    queryFn: () => obtenerCorreccionAlumno(idEjercicio),
    enabled: Number.isInteger(idEjercicio) && idEjercicio > 0,
  });
}
