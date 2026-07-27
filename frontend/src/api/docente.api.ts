import clienteApi from './clienteApi';
import type { CursoDocenteResumen, DocenteActual } from '../types/docente.types';

export async function obtenerDocenteActual(): Promise<DocenteActual> {
  const respuesta = await clienteApi.get<DocenteActual>('/docentes/me');

  return respuesta.data;
}

export async function obtenerCursosDocente(): Promise<CursoDocenteResumen[]> {
  const response = await clienteApi.get<CursoDocenteResumen[]>('/docentes/me/cursos');

  return response.data;
}
