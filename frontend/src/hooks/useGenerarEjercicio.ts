import { useMutation } from '@tanstack/react-query';

import { generarEjercicioIA } from '../api/ejercicio.api';

export function useGenerarEjercicio() {
  return useMutation({
    mutationFn: generarEjercicioIA,
  });
}
