import { useQuery } from '@tanstack/react-query';

import { obtenerEntregasSimulacion } from '../api/simulacion.api';

import type { FiltrosEntregasSimulacion } from '../types/simulacion.types';

export function useEntregasSimulacion(idSimulacion: number, filtros: FiltrosEntregasSimulacion) {
  return useQuery({
    queryKey: ['simulaciones', idSimulacion, 'entregas', filtros],
    queryFn: () => obtenerEntregasSimulacion(idSimulacion, filtros),
    enabled: idSimulacion > 0,
  });
}
