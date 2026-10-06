import { useMutation } from '@tanstack/react-query';

import { digitalizarEjercicio } from '../api/ejercicio.api';

export function useDigitalizarEjercicio() {
  return useMutation({
    mutationFn: digitalizarEjercicio,
  });
}
