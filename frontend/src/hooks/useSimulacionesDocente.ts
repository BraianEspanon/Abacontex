import { useQuery } from '@tanstack/react-query';

import { obtenerSimulacionesDocente } from '../api/simulacion.api';

import type { FiltrosSimulacionesDocente } from '../types/simulacion.types';

export function useSimulacionesDocente(filtros: FiltrosSimulacionesDocente) {
  return useQuery({
    queryKey: ['simulaciones', 'docente', filtros],
    queryFn: () => obtenerSimulacionesDocente(filtros),
  });
}
