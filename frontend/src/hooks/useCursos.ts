import { useQuery } from '@tanstack/react-query';
import { obtenerCursos } from '../api/course.api';

export function useCursos() {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: obtenerCursos,
  });
}
