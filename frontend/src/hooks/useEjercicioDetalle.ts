import { useQuery } from '@tanstack/react-query';

import { obtenerEjercicioPorId } from '../api/ejercicio.api';

export function useEjercicioDetalle(idEjercicio: number) {
  return useQuery({
    queryKey: ['ejercicio', idEjercicio],
    queryFn: () => obtenerEjercicioPorId(idEjercicio),
    enabled: idEjercicio > 0,
  });
}
