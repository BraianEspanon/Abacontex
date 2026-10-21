import { useQuery } from '@tanstack/react-query';

import { obtenerEjerciciosAlumno } from '../api/entrega.api';

import type { FiltrosEjerciciosAlumno } from '../types/entrega.types';

export function useEjerciciosAlumno(filtros: FiltrosEjerciciosAlumno) {
  return useQuery({
    queryKey: ['ejercicios-alumno', filtros],
    queryFn: () => obtenerEjerciciosAlumno(filtros),
  });
}
