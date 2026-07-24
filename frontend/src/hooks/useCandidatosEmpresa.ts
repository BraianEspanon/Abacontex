import { useQuery } from '@tanstack/react-query';
import { obtenerCandidatosEmpresa } from '../api/empresa.api';

export function useCandidatosEmpresa(search: string) {
  return useQuery({
    queryKey: ['empresas', 'candidatos', search],
    queryFn: () => obtenerCandidatosEmpresa(search),
    staleTime: 60 * 1000,
    retry: false,
  });
}