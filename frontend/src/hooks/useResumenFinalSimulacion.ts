import { useQuery } from '@tanstack/react-query';

import { obtenerResumenFinalSimulacion } from '../api/simulacion.api';

export function useResumenFinalSimulacion(idSimulacionEmpresa: number) {
  return useQuery({
    queryKey: ['simulaciones', 'conversacion', idSimulacionEmpresa, 'resumen'],
    queryFn: () => obtenerResumenFinalSimulacion(idSimulacionEmpresa),
    enabled: idSimulacionEmpresa > 0,
  });
}
