import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sugerirRefuerzoCurso } from '../api/analisisErrores.api';

export function useSugerirRefuerzoCurso(cursoId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (cursoId === null || !Number.isInteger(cursoId) || cursoId <= 0) {
        throw new Error('Seleccioná un curso válido.');
      }

      await sugerirRefuerzoCurso(cursoId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['correcciones', 'analisis-errores', cursoId],
      });
    },
  });
}
