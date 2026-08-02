import api from '../services/axios';
import type { CompletarRegistroRequest, RegistroResponse } from '../types/registro.types';
import type { AlumnoActualResponse } from '../types/alumno.types';

export async function obtenerAlumnoActual(): Promise<AlumnoActualResponse> {
  const response = await api.get<AlumnoActualResponse>('/alumnos/me');

  return response.data;
}

export async function obtenerDatosRegistro(): Promise<RegistroResponse> {
  const response = await api.get<RegistroResponse>('/alumnos/me/registro');

  return response.data;
}

export async function completarRegistroAlumno(payload: CompletarRegistroRequest): Promise<void> {
  await api.patch('/alumnos/me/registro', payload);
}
