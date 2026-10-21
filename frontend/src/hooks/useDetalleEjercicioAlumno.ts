import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleEjercicioAlumno } from '../api/entrega.api';

export function useDetalleEjercicioAlumno(idEjercicio: number) {
  return useQuery({
    queryKey: ['detalle-ejercicio-alumno', idEjercicio],
    queryFn: () => obtenerDetalleEjercicioAlumno(idEjercicio),
    enabled: idEjercicio > 0,
  });
}
