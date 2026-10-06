import { useMutation } from '@tanstack/react-query';

import { crearEjercicio } from '../api/ejercicio.api';

export function useCrearEjercicio() {
  return useMutation({
    mutationFn: crearEjercicio,
  });
}
