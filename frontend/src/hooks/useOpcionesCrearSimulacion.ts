import { useQuery } from '@tanstack/react-query';

import { obtenerOpcionesCrearSimulacion } from '../api/simulacion.api';

export function useOpcionesCrearSimulacion() {
  return useQuery({
    queryKey: ['simulaciones', 'opciones-crear'],
    queryFn: obtenerOpcionesCrearSimulacion,
  });
}
