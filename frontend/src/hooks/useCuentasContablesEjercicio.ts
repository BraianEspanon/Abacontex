import { useQuery } from '@tanstack/react-query';

import { obtenerCuentasContables } from '../api/ejercicio.api';

export function useCuentasContablesEjercicio() {
  return useQuery({
    queryKey: ['contabilidad', 'cuentas', 'ejercicios'],
    queryFn: obtenerCuentasContables,
    staleTime: 5 * 60 * 1000,
  });
}
