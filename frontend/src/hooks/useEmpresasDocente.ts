import { useQuery } from '@tanstack/react-query';

import { obtenerEmpresasDocente } from '../api/empresa.api';
import type { ObtenerEmpresasDocenteParams } from '../types/empresa-docente.type';

export function useEmpresasDocente(params: ObtenerEmpresasDocenteParams) {
  return useQuery({
    queryKey: ['empresas-docente', params],
    queryFn: () => obtenerEmpresasDocente(params),
    placeholderData: (previousData) => previousData,
  });
}
