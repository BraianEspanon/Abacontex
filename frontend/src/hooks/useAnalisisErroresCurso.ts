import { useQuery } from '@tanstack/react-query';

import { obtenerAnalisisErroresCurso } from '../api/analisisErrores.api';

export function useAnalisisErroresCurso(cursoId: number | null) {
  return useQuery({
    queryKey: ['correcciones', 'analisis-errores', cursoId],
    queryFn: () => obtenerAnalisisErroresCurso(cursoId!),
    enabled: cursoId !== null && Number.isInteger(cursoId) && cursoId > 0,
  });
}
