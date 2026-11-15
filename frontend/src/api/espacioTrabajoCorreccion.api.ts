import clienteApi from './clienteApi';

import type {
  BorradorCorreccionResponse,
  ComentarioErrorRequest,
  ComentarioErrorResponse,
  EspacioTrabajoCorreccion,
  FinalizarCorreccionResponse,
  RetroalimentacionRequest,
  RevisionPlantillaRequest,
  RevisionPlantillaResponse,
  SugerenciaRetroalimentacionResponse,
} from '../types/espacioTrabajoCorreccion.types';

const BASE_URL = '/correcciones/entregas';

export async function obtenerEspacioTrabajoCorreccion(
  entregaId: number
): Promise<EspacioTrabajoCorreccion> {
  const { data } = await clienteApi.get<EspacioTrabajoCorreccion>(`${BASE_URL}/${entregaId}`);

  return data;
}

export async function actualizarRevisionPlantilla(
  entregaId: number,
  plantillaId: number,
  datos: RevisionPlantillaRequest
): Promise<RevisionPlantillaResponse> {
  const { data } = await clienteApi.patch<RevisionPlantillaResponse>(
    `${BASE_URL}/${entregaId}/plantillas/${plantillaId}`,
    datos
  );

  return data;
}

export async function guardarBorradorCorreccion(
  entregaId: number,
  datos: RetroalimentacionRequest
): Promise<BorradorCorreccionResponse> {
  const { data } = await clienteApi.patch<BorradorCorreccionResponse>(
    `${BASE_URL}/${entregaId}/borrador`,
    datos
  );

  return data;
}

export async function guardarComentarioError(
  entregaId: number,
  datos: ComentarioErrorRequest
): Promise<ComentarioErrorResponse> {
  const { data } = await clienteApi.patch<ComentarioErrorResponse>(
    `${BASE_URL}/${entregaId}/errores/comentario`,
    datos
  );

  return data;
}

export async function sugerirRetroalimentacionIa(
  entregaId: number
): Promise<SugerenciaRetroalimentacionResponse> {
  const { data } = await clienteApi.post<SugerenciaRetroalimentacionResponse>(
    `${BASE_URL}/${entregaId}/sugerir-retroalimentacion`
  );

  return data;
}

export async function finalizarCorreccion(
  entregaId: number,
  datos: RetroalimentacionRequest
): Promise<FinalizarCorreccionResponse> {
  const { data } = await clienteApi.post<FinalizarCorreccionResponse>(
    `${BASE_URL}/${entregaId}/finalizar`,
    datos
  );

  return data;
}
