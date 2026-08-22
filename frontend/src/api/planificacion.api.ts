import clienteApi from './clienteApi';

import type {
  ActualizarPlanificacionMensualRequest,
  CrearPlanificacionRequest,
  DetallePlanificacionActualizado,
  PlanificacionAnual,
} from '../types/planificacion.types';

/**
 * Obtiene la planificación anual de producción
 * correspondiente a la empresa del alumno autenticado.
 *
 * Si todavía no existe una planificación cargada,
 * el backend devuelve estado PENDIENTE y meses vacíos.
 */
export async function obtenerPlanificacionAnual(): Promise<PlanificacionAnual> {
  const { data } = await clienteApi.get<PlanificacionAnual>('/planificacion');

  return data;
}

/**
 * Crea la planificación anual de producción.
 *
 * Solo puede existir una planificación por empresa
 * y ciclo lectivo.
 */
export async function crearPlanificacionAnual(
  payload: CrearPlanificacionRequest
): Promise<PlanificacionAnual> {
  const { data } = await clienteApi.post<PlanificacionAnual>('/planificacion', payload);

  return data;
}

/**
 * Actualiza la cantidad estimada de producción
 * correspondiente a un mes de la planificación.
 */
export async function actualizarPlanificacionMensual(
  idDetalle: number,
  payload: ActualizarPlanificacionMensualRequest
): Promise<DetallePlanificacionActualizado> {
  const { data } = await clienteApi.patch<DetallePlanificacionActualizado>(
    `/planificacion/${idDetalle}`,
    payload
  );

  return data;
}
