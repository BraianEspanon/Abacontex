import clienteApi from './clienteApi';

import type {
  CrearEjercicioRequest,
  DigitalizarEjercicioResponse,
  EjercicioCreadoResponse,
  FiltrosEjercicios,
  ListadoEjerciciosResponse,
  GenerarEjercicioIARequest,
  GenerarEjercicioIAResponse,
  DetalleEjercicio,
  EditarEjercicioRequest,
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

export async function generarEjercicioIA(parametros: GenerarEjercicioIARequest) {
  const { data } = await clienteApi.post<GenerarEjercicioIAResponse>(
    '/ejercicios/generar',
    parametros
  );

  return data;
}

export async function obtenerEjercicioPorId(idEjercicio: number) {
  const { data } = await clienteApi.get<DetalleEjercicio>(`/ejercicios/${idEjercicio}`);

  return data;
}

export async function editarEjercicio(idEjercicio: number, datos: EditarEjercicioRequest) {
  const { data } = await clienteApi.patch<DetalleEjercicio>(`/ejercicios/${idEjercicio}`, datos);

  return data;
}
