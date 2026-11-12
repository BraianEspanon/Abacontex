import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerEjerciciosACorregir } from '../api/correccion.api';

import type { FiltrosCorreccionesParams } from '../types/correccion.types';

export function useEjerciciosACorregir(params: FiltrosCorreccionesParams) {
  return useQuery({
    queryKey: ['correcciones', 'ejercicios', params],
    queryFn: () => obtenerEjerciciosACorregir(params),
    placeholderData: keepPreviousData,
  });
}
