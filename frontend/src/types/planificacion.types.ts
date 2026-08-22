export type EstadoPlanificacionAnual = 'PENDIENTE' | 'CARGADA';

export type EstadoMesPlanificacion = 'SIN_INICIAR' | 'EN_CURSO' | 'COMPLETADO';

export interface ResumenPlanificacionAnual {
  unidadesEstimadas: number;
  unidadesProducidas: number;
  cumplimiento: number;
}

export interface MesPlanificacionAnual {
  id: number;
  mes: number;

  unidadesEstimadas: number;
  unidadesProducidas: number;

  cumplimiento: number;

  estado: EstadoMesPlanificacion;
}

export interface PlanificacionAnual {
  cicloLectivo: number;

  estado: EstadoPlanificacionAnual;

  mesInicio: number | null;
  mesFin: number | null;

  resumen: ResumenPlanificacionAnual;

  meses: MesPlanificacionAnual[];
}

export interface DetalleCrearPlanificacion {
  mes: number;
  unidadesEstimadas: number;
}

export interface CrearPlanificacionRequest {
  mesInicio: number;
  mesFin: number;

  detalles: DetalleCrearPlanificacion[];
}

export interface ActualizarPlanificacionMensualRequest {
  unidadesEstimadas: number;
}

export interface DetallePlanificacionActualizado {
  idDetalle: number;
  planificacionId: number;
  mes: number;
  unidadesEstimadas: number | null;
  createdAt: string;
  updatedAt: string;
}
