import clienteApi from './clienteApi';

import type { AnalisisErroresCursoResponse } from '../types/analisisErrores.types';

export async function obtenerAnalisisErroresCurso(
  cursoId: number
): Promise<AnalisisErroresCursoResponse> {
  const { data } = await clienteApi.get<AnalisisErroresCursoResponse>(
    `/correcciones/cursos/${cursoId}/analisis-errores`
  );

  return data;
}

export async function sugerirRefuerzoCurso(cursoId: number): Promise<void> {
  await clienteApi.post(`/correcciones/cursos/${cursoId}/sugerir-refuerzo`);
}
