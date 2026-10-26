import clienteApi from './clienteApi';

import type {
  DetalleEjercicioAlumno,
  FiltrosDisponiblesEjerciciosAlumno,
  FiltrosEjerciciosAlumno,
  GuardarPlantillaAlumnoRequest,
  GuardarPlantillaAlumnoResponse,
  ListadoEjerciciosAlumnoResponse,
  ResolucionAlumnoResponse,
} from '../types/entrega.types';

export async function obtenerEjerciciosAlumno(filtros: FiltrosEjerciciosAlumno = {}) {
  const { data } = await clienteApi.get<ListadoEjerciciosAlumnoResponse>('/entregas', {
    params: filtros,
  });

  return data;
}

export async function obtenerFiltrosEjerciciosAlumno() {
  const { data } = await clienteApi.get<FiltrosDisponiblesEjerciciosAlumno>('/entregas/filtros');

  return data;
}

export async function obtenerDetalleEjercicioAlumno(idEjercicio: number) {
  const { data } = await clienteApi.get<DetalleEjercicioAlumno>(`/entregas/${idEjercicio}`);

  return data;
}

export async function obtenerResolucionAlumno(idEjercicio: number) {
  const { data } = await clienteApi.get<ResolucionAlumnoResponse>(
    `/entregas/${idEjercicio}/resolucion`
  );

  return data;
}

export async function guardarPlantillaAlumno(
  idEjercicio: number,
  datos: GuardarPlantillaAlumnoRequest
) {
  const { data } = await clienteApi.patch<GuardarPlantillaAlumnoResponse>(
    `/entregas/${idEjercicio}/plantilla`,
    datos
  );

  return data;
}

export async function finalizarEntregaAlumno(idEjercicio: number) {
  const response = await clienteApi.post(`/entregas/${idEjercicio}/finalizar`);

  return response.data;
}
