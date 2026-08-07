import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completarRegistroAlumno } from '../api/alumno.api';

export function useCompletarRegistro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completarRegistroAlumno,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['alumno-actual'] }),
        queryClient.invalidateQueries({ queryKey: ['datos-registro'] }),
        queryClient.invalidateQueries({ queryKey: ['invitacion-activa'] }),
      ]);
    },
  });
}
