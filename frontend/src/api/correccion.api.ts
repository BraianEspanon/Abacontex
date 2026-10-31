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
