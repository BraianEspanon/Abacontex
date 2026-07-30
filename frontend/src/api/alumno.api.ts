import api from '../services/axios';
import type { CompletarRegistroAlumnoPayload } from '../types/alumno.types';

export async function completarRegistroAlumno(
  payload: CompletarRegistroAlumnoPayload
): Promise<void> {
  await api.patch('/alumnos/me/registro', payload);
}
