import clienteApi from './clienteApi';
import type { AlumnoDisponible } from '../types/empresa.types';

export async function obtenerCandidatosEmpresa(
  search?: string,
): Promise<AlumnoDisponible[]> {
  const termino = search?.trim();

  const respuesta = await clienteApi.get<AlumnoDisponible[]>(
    '/empresas/candidatos',
    {
      params: termino ? { search: termino } : undefined,
    },
  );

  return respuesta.data;
}