import { useQuery } from '@tanstack/react-query';

import { obtenerEjerciciosACorregir } from '../api/correccion.api';

export function useCorreccionesResumen(cursoId?: number) {
  return useQuery({
    queryKey: ['correcciones', 'resumen', cursoId ?? 'todos'],
    queryFn: () =>
      obtenerEjerciciosACorregir({
        page: 1,
        pageSize: 50,
        cursoId,
        estado: 'TODAS',
      }),
  });
}
