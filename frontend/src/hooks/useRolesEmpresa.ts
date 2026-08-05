import { useQuery } from '@tanstack/react-query';
import { obtenerRolesEmpresa } from '../api/rol-empresa.api';

export function useRolesEmpresa() {
  return useQuery({
    queryKey: ['roles-empresa'],
    queryFn: obtenerRolesEmpresa,
  });
}
