import { useQuery } from '@tanstack/react-query';
import { obtenerAlumnoActual } from '../api/alumno.api';

export function useAlumnoActual() {
  return useQuery({
    queryKey: ['alumno-actual'],
    queryFn: obtenerAlumnoActual,
  });
}
