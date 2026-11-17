import clienteApi from './clienteApi';

import type {
  FiltrosDashboardSimulacionDocenteResponse,
  FiltrosSimulacionesDocente,
  ListadoSimulacionesDocenteResponse,
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
