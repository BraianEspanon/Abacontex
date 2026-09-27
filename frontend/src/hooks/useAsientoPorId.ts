import { useQuery } from '@tanstack/react-query';

import { obtenerAsientoPorId } from '../api/contabilidad.api';

export function useAsientoPorId(idAsiento: number | undefined, enabled = true) {
  return useQuery({
    queryKey: ['contabilidad', 'asiento', idAsiento],
    queryFn: () => obtenerAsientoPorId(idAsiento!),
    enabled: enabled && idAsiento !== undefined && Number.isInteger(idAsiento) && idAsiento > 0,
  });
}
