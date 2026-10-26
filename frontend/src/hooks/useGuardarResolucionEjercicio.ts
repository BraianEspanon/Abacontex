import { useMutation, useQueryClient } from '@tanstack/react-query';

import { actualizarResolucionDocente } from '../api/ejercicio.api';

import type { ActualizarResolucionDocenteRequest } from '../types/ejercicio.types';

interface GuardarResolucionParams {
  idEjercicio: number;
  datos: ActualizarResolucionDocenteRequest;
}

export function useGuardarResolucionEjercicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idEjercicio, datos }: GuardarResolucionParams) =>
      actualizarResolucionDocente(idEjercicio, datos),

    onSuccess: (resolucion, variables) => {
      queryClient.setQueryData(['ejercicios', variables.idEjercicio, 'resolucion'], resolucion);

      void queryClient.invalidateQueries({
        queryKey: ['ejercicios'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['ejercicios', variables.idEjercicio],
      });
    },
  });
}
