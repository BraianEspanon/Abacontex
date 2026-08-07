import { useQuery } from '@tanstack/react-query';
import { obtenerDatosRegistro } from '../api/alumno.api';

export function useDatosRegistro() {
  return useQuery({
    queryKey: ['datos-registro'],
    queryFn: obtenerDatosRegistro,
  });
}
