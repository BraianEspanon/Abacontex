import { useQuery } from '@tanstack/react-query';

import { obtenerEjercicios } from '../api/ejercicio.api';
import type { FiltrosEjercicios } from '../types/ejercicio.types';

export function useEjercicios(filtros: FiltrosEjercicios) {
  return useQuery({
    queryKey: ['ejercicios', filtros],
    queryFn: () => obtenerEjercicios(filtros),
  });
}
