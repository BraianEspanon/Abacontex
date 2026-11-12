import { useQuery } from '@tanstack/react-query';

import { obtenerEntregasCorreccion } from '../api/correccion.api';

import type { ParametrosEntregasCorreccion } from '../types/correccion.types';

export function useEntregasCorreccion(ejercicioId: number, params: ParametrosEntregasCorreccion) {
  return useQuery({
    queryKey: ['correcciones', 'entregas', ejercicioId, params],
    queryFn: () => obtenerEntregasCorreccion(ejercicioId, params),
    enabled: Number.isInteger(ejercicioId) && ejercicioId > 0,
  });
}
