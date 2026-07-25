import clienteApi from './clienteApi';
import type { DocenteActual } from '../types/docente.types';

export async function obtenerDocenteActual(): Promise<DocenteActual> {
  const respuesta = await clienteApi.get<DocenteActual>('/docentes/me');

  return respuesta.data;
}
