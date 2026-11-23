import clienteApi from './clienteApi';

import type {
  CrearSimulacionRequest,
  EntregasSimulacionResponse,
  FiltrosDashboardSimulacionDocenteResponse,
  FiltrosEntregasSimulacion,
  FiltrosSimulacionesDocente,
  ListadoSimulacionesDocenteResponse,
  OpcionesCrearSimulacionResponse,
  SimulacionCreadaResponse,
  ConversacionSimulacionResponse,
  ResumenFinalSimulacionResponse,
  FiltrosDashboardSimulacionAlumnoResponse,
  FiltrosSimulacionesAlumno,
  ListadoSimulacionesAlumnoResponse,
  ResponderDecisionSimulacionResponse,
} from '../types/simulacion.types';

export async function obtenerSimulacionesDocente(filtros: FiltrosSimulacionesDocente = {}) {
  const { data } = await clienteApi.get<ListadoSimulacionesDocenteResponse>('/simulaciones', {
    params: filtros,
  });

  return data;
}

export async function obtenerFiltrosSimulacionesDocente() {
  const { data } = await clienteApi.get<FiltrosDashboardSimulacionDocenteResponse>(
    '/simulaciones/docente/filtros'
  );

  return data;
}

export async function obtenerOpcionesCrearSimulacion() {
  const { data } = await clienteApi.get<OpcionesCrearSimulacionResponse>(
    '/simulaciones/opciones-crear'
  );

  return data;
}

export async function crearSimulacion(datos: CrearSimulacionRequest) {
  const { data } = await clienteApi.post<SimulacionCreadaResponse>('/simulaciones', datos);

  return data;
}

export async function obtenerEntregasSimulacion(
  idSimulacion: number,
  filtros: FiltrosEntregasSimulacion = {}
) {
  const { data } = await clienteApi.get<EntregasSimulacionResponse>(
    `/simulaciones/${idSimulacion}/entregas`,
    {
      params: filtros,
    }
  );

  return data;
}

export async function obtenerConversacionSimulacion(idSimulacionEmpresa: number) {
  const { data } = await clienteApi.get<ConversacionSimulacionResponse>(
    `/simulaciones/conversacion/${idSimulacionEmpresa}`
  );

  return data;
}

export async function obtenerResumenFinalSimulacion(idSimulacionEmpresa: number) {
  const { data } = await clienteApi.get<ResumenFinalSimulacionResponse>(
    `/simulaciones/conversacion/${idSimulacionEmpresa}/resumen`
  );

  return data;
}

export async function obtenerSimulacionesAlumno(filtros: FiltrosSimulacionesAlumno = {}) {
  const { data } = await clienteApi.get<ListadoSimulacionesAlumnoResponse>('/simulaciones/alumno', {
    params: filtros,
  });

  return data;
}

export async function obtenerFiltrosSimulacionesAlumno() {
  const { data } = await clienteApi.get<FiltrosDashboardSimulacionAlumnoResponse>(
    '/simulaciones/alumno/filtros'
  );

  return data;
}

export async function responderDecisionSimulacion(idSimulacionEmpresa: number, idOpcion: number) {
  const { data } = await clienteApi.post<ResponderDecisionSimulacionResponse>(
    `/simulaciones/conversacion/${idSimulacionEmpresa}/responder`,
    {
      idOpcion,
    }
  );

  return data;
}
