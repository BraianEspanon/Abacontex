import clienteApi from './clienteApi';

import type {
  CrearEjercicioRequest,
  DigitalizarEjercicioResponse,
  EjercicioCreadoResponse,
  FiltrosEjercicios,
  ListadoEjerciciosResponse,
} from '../types/ejercicio.types';

export async function obtenerEjercicios(filtros: FiltrosEjercicios = {}) {
  const { data } = await clienteApi.get<ListadoEjerciciosResponse>('/ejercicios', {
    params: filtros,
  });

  return data;
}

export async function digitalizarEjercicio(archivo: File) {
  const formData = new FormData();

  formData.append('archivo', archivo);

  const { data } = await clienteApi.post<DigitalizarEjercicioResponse>(
    '/ejercicios/digitalizar',
    formData
  );

  return data;
}

export async function crearEjercicio(ejercicio: CrearEjercicioRequest) {
  const { data } = await clienteApi.post<EjercicioCreadoResponse>('/ejercicios', ejercicio);

  return data;
}
