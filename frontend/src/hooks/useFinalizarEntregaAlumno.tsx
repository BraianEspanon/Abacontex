import { useMutation, useQueryClient } from '@tanstack/react-query';

import { finalizarEntregaAlumno } from '../api/entrega.api';

export function useFinalizarEntregaAlumno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idEjercicio: number) => finalizarEntregaAlumno(idEjercicio),

    onSuccess: async (_, idEjercicio) => {
      await queryClient.invalidateQueries({
        queryKey: ['entregas'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['entrega', idEjercicio],
      });

      await queryClient.invalidateQueries({
        queryKey: ['resolucion-alumno', idEjercicio],
      });
    },
  });
}
