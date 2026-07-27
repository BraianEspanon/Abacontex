import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actualizarEmpresa, type ActualizarEmpresaRequest } from '../api/empresa.api';

export function useActualizarEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: ActualizarEmpresaRequest) => actualizarEmpresa(datos),

    onSuccess: (empresaActualizada) => {
      queryClient.setQueryData(['empresa-actual'], empresaActualizada);
    },
  });
}
