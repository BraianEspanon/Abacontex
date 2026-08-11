export const ESTADOS_PLANIFICACION = {
  PENDIENTE: 'PENDIENTE',
  CARGADA: 'CARGADA',
} as const;

export type EstadoPlanificacion =
  (typeof ESTADOS_PLANIFICACION)[keyof typeof ESTADOS_PLANIFICACION];
