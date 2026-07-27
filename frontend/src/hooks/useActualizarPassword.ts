import { useMutation } from '@tanstack/react-query';

import { actualizarPassword } from '../api/usuario.api';

export function useActualizarPassword() {
  return useMutation({
    mutationFn: actualizarPassword,
  });
}
