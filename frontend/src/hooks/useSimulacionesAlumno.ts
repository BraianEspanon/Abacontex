import { useQuery } from '@tanstack/react-query';

import { obtenerFiltrosSimulacionesAlumno, obtenerSimulacionesAlumno } from '../api/simulacion.api';

import type { FiltrosSimulacionesAlumno } from '../types/simulacion.types';

export function useSimulacionesAlumno(filtros: FiltrosSimulacionesAlumno) {
  return useQuery({
    queryKey: ['simulaciones', 'alumno', filtros],
    queryFn: () => obtenerSimulacionesAlumno(filtros),
  });
}

export function useFiltrosSimulacionesAlumno() {
  return useQuery({
    queryKey: ['simulaciones', 'alumno', 'filtros'],
    queryFn: obtenerFiltrosSimulacionesAlumno,
  });
}
