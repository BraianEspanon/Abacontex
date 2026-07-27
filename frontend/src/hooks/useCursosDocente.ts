import { useQuery } from '@tanstack/react-query';
import { obtenerCursosDocente } from '../api/docente.api';

export function useCursosDocente() {
  return useQuery({
    queryKey: ['docente', 'cursos'],
    queryFn: obtenerCursosDocente,
  });
}
