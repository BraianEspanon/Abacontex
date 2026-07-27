import { useQuery } from '@tanstack/react-query';
import { obtenerEmpresaActual } from '../api/empresa.api';

export function useEmpresaActual() {
  return useQuery({
    queryKey: ['empresa-actual'],
    queryFn: obtenerEmpresaActual,
  });
}
