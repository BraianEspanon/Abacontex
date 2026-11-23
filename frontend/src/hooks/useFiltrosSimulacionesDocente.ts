import { useQuery } from '@tanstack/react-query';

import { obtenerFiltrosSimulacionesDocente } from '../api/simulacion.api';

export function useFiltrosSimulacionesDocente() {
  return useQuery({
    queryKey: ['simulaciones', 'docente', 'filtros'],
    queryFn: obtenerFiltrosSimulacionesDocente,
  });
}
