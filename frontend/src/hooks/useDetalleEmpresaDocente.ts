import { useQuery } from '@tanstack/react-query';

import { obtenerDetalleEmpresaDocente } from '../api/empresa.api';

export function useDetalleEmpresaDocente(empresaId: number | null) {
  return useQuery({
    queryKey: ['empresa-docente-detalle', empresaId],
    queryFn: () => obtenerDetalleEmpresaDocente(empresaId as number),
    enabled: empresaId !== null,
  });
}