import { useQuery } from '@tanstack/react-query';

import { obtenerMetodosPago } from '../api/metodo-pago.api';

export function useMetodosPago() {
  return useQuery({
    queryKey: ['metodos-pago'],
    queryFn: obtenerMetodosPago,
  });
}
