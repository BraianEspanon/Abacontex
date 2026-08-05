import { useMutation } from '@tanstack/react-query';
import { crearDocente } from '../api/docente.api';

export function useCrearDocente() {
  return useMutation({
    mutationFn: crearDocente,
  });
}
