import api from '../services/axios';
import type { Curso } from '../types/curso.types';

//Se llama al endpoint de GET /cursos y devuelve una lista
export async function obtenerCursos(): Promise<Curso[]> {
  const { data } = await api.get<Curso[]>('/cursos');

  return data;
}
