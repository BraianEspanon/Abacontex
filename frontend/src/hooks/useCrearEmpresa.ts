import { useMutation } from '@tanstack/react-query';
import { crearEmpresa, type CrearEmpresaRequest } from '../api/empresa.api';

export function useCrearEmpresa() {
  return useMutation({
    mutationFn: (datos: CrearEmpresaRequest) => crearEmpresa(datos),
  });
}
