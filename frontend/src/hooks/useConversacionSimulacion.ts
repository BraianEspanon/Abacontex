import { useQuery } from '@tanstack/react-query';

import { obtenerConversacionSimulacion } from '../api/simulacion.api';

export function useConversacionSimulacion(idSimulacionEmpresa: number) {
  return useQuery({
    queryKey: ['simulaciones', 'conversacion', idSimulacionEmpresa],
    queryFn: () => obtenerConversacionSimulacion(idSimulacionEmpresa),
    enabled: idSimulacionEmpresa > 0,
  });
}
