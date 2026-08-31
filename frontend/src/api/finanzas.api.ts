import clienteApi from './clienteApi';

import type {
  CategoriasFinancierasAgrupadas,
  ConciliacionRegistrada,
  ConciliacionesQueryParams,
  ConciliacionesResponse,
  DatoGraficoFinanciero,
  MovimientoFinanciero,
  MovimientosFinancierosQueryParams,
  MovimientosFinancierosResponse,
  PeriodoGraficoFinanciero,
  RegistrarConciliacionRequest,
  RegistrarMovimientoRequest,
  ResumenConciliacion,
  ResumenFinanciero,
  TipoMovimiento,
} from '../types/finanzas.types';

export async function obtenerResumenFinanciero(): Promise<ResumenFinanciero> {
  const { data } = await clienteApi.get<ResumenFinanciero>('/finanzas/resumen');

  return data;
}

export async function obtenerGraficoFinanciero(
  periodo: PeriodoGraficoFinanciero
): Promise<DatoGraficoFinanciero[]> {
  const { data } = await clienteApi.get<DatoGraficoFinanciero[]>('/finanzas/grafico', {
    params: {
      periodo,
    },
  });

  return data;
}

export async function obtenerMovimientosFinancieros(
  params: MovimientosFinancierosQueryParams = {}
): Promise<MovimientosFinancierosResponse> {
  const { data } = await clienteApi.get<MovimientosFinancierosResponse>('/finanzas/movimientos', {
    params,
  });

  return data;
}

export async function obtenerTiposMovimiento(): Promise<TipoMovimiento[]> {
  const { data } = await clienteApi.get<TipoMovimiento[]>('/finanzas/tipos-movimiento');

  return data;
}

export async function obtenerCategoriasFinancieras(): Promise<CategoriasFinancierasAgrupadas> {
  const { data } = await clienteApi.get<CategoriasFinancierasAgrupadas>('/finanzas/categorias');

  return data;
}

export async function registrarMovimientoFinanciero(
  datos: RegistrarMovimientoRequest
): Promise<MovimientoFinanciero> {
  const { data } = await clienteApi.post<MovimientoFinanciero>('/finanzas/movimientos', datos);

  return data;
}

export async function obtenerResumenConciliacion(): Promise<ResumenConciliacion> {
  const { data } = await clienteApi.get<ResumenConciliacion>('/finanzas/conciliaciones/resumen');

  return data;
}

export async function obtenerConciliaciones(
  params: ConciliacionesQueryParams = {}
): Promise<ConciliacionesResponse> {
  const { data } = await clienteApi.get<ConciliacionesResponse>('/finanzas/conciliaciones', {
    params,
  });

  return data;
}

export async function registrarConciliacion(
  datos: RegistrarConciliacionRequest
): Promise<ConciliacionRegistrada> {
  const { data } = await clienteApi.post<ConciliacionRegistrada>('/finanzas/conciliaciones', datos);

  return data;
}
