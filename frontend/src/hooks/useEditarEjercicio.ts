import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editarEjercicio } from '../api/ejercicio.api';
import type { EditarEjercicioRequest } from '../types/ejercicio.types';

export function useEditarEjercicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idEjercicio, datos }: { idEjercicio: number; datos: EditarEjercicioRequest }) =>
      editarEjercicio(idEjercicio, datos),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ejercicio', variables.idEjercicio],
      });

      queryClient.invalidateQueries({
        queryKey: ['ejercicios'],
      });
    },
  });
}
