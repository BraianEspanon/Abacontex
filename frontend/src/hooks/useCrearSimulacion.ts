import { useMutation, useQueryClient } from '@tanstack/react-query';

import { crearSimulacion } from '../api/simulacion.api';

import type { CrearSimulacionRequest } from '../types/simulacion.types';

export function useCrearSimulacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: CrearSimulacionRequest) => crearSimulacion(datos),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['simulaciones', 'docente'],
      });
    },
  });
}
