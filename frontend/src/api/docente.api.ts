import clienteApi from './clienteApi';
import type {
  CrearDocenteRequest,
  CursoDocenteResumen,
  DashboardDocente,
  DocenteActual,
  DocenteCreado,
} from '../types/docente.types';

export async function obtenerDocenteActual(): Promise<DocenteActual> {
  const respuesta = await clienteApi.get<DocenteActual>('/docentes/me');

  return respuesta.data;
}
export async function obtenerCursosDocente(): Promise<CursoDocenteResumen[]> {
  const response = await clienteApi.get<CursoDocenteResumen[]>('/docentes/me/cursos');

  return response.data;
}

export async function crearDocente(payload: CrearDocenteRequest): Promise<DocenteCreado> {
  const response = await clienteApi.post<DocenteCreado>('/docentes', payload);

  return response.data;
}
export async function obtenerDashboardDocente(): Promise<DashboardDocente> {
  const response = await clienteApi.get<DashboardDocente>('/docentes/me/dashboard');

  return response.data;
}
