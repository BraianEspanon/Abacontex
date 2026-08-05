import { useQuery } from '@tanstack/react-query';
import { obtenerAlumnoActual } from '../api/alumno.api';

export function useAlumnoActual(enabled = true) {
  return useQuery({
    queryKey: ['alumno-actual'],
    queryFn: obtenerAlumnoActual,
    enabled,
    retry: false,
  });
}
