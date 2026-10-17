export const ESTADOS_ENTREGA_ALUMNO = [
  'PENDIENTE',
  'EN_PROGRESO',
  'ENTREGADO',
  'CORREGIDO',
  'VENCIDO',
] as const;

export type EstadoEntregaAlumno = (typeof ESTADOS_ENTREGA_ALUMNO)[number];

export const FILTROS_ESTADO_ENTREGA_ALUMNO = [
  'TODAS',
  'PENDIENTE',
  'EN_PROGRESO',
  'ENTREGADO',
  'CORREGIDO',
  'VENCIDO',
] as const;

export type FiltroEstadoEntregaAlumno = (typeof FILTROS_ESTADO_ENTREGA_ALUMNO)[number];
