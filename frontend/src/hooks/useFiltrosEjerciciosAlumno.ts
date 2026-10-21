import { useQuery } from '@tanstack/react-query';

import { obtenerFiltrosEjerciciosAlumno } from '../api/entrega.api';

export function useFiltrosEjerciciosAlumno() {
  return useQuery({
    queryKey: ['filtros-ejercicios-alumno'],
    queryFn: obtenerFiltrosEjerciciosAlumno,
  });
}
