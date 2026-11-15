import clienteApi from './clienteApi';

import type { CorreccionesResponse, FiltrosCorreccionesParams } from '../types/correccion.types';

export async function obtenerEjerciciosACorregir(
  params: FiltrosCorreccionesParams = {}
): Promise<CorreccionesResponse> {
  const respuesta = await clienteApi.get<CorreccionesResponse>('/correcciones/ejercicios', {
    params,
  });

  return respuesta.data;
}

import type {
  EntregasEjercicioResponse,
  FiltrosTableroCorreccionResponse,
  ParametrosEntregasCorreccion,
} from '../types/correccion.types';

export async function obtenerFiltrosCorrecciones(): Promise<FiltrosTableroCorreccionResponse> {
  const { data } = await clienteApi.get<FiltrosTableroCorreccionResponse>('/correcciones/filtros');

  return data;
}

export async function obtenerEntregasCorreccion(
  ejercicioId: number,
  params: ParametrosEntregasCorreccion = {}
): Promise<EntregasEjercicioResponse> {
  const { data } = await clienteApi.get<EntregasEjercicioResponse>(
    `/correcciones/ejercicios/${ejercicioId}/entregas`,
    { params }
  );

  return data;
}
