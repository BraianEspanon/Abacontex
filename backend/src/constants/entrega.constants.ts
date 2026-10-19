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

export const OPCIONES_FILTRO_ESTADO_ENTREGA: readonly {
  clave: FiltroEstadoEntregaAlumno;
  label: string;
}[] = [
  { clave: 'TODAS', label: 'Todas' },
  { clave: 'PENDIENTE', label: 'Pendientes' },
  { clave: 'EN_PROGRESO', label: 'En progreso' },
  { clave: 'ENTREGADO', label: 'Entregadas' },
  { clave: 'CORREGIDO', label: 'Corregidas' },
  { clave: 'VENCIDO', label: 'Vencidas' },
] as const;

export const ESTADOS_GUARDAR_PLANTILLA_ALUMNO = ['EN_EDICION', 'COMPLETADA'] as const;
export type EstadoGuardarPlantillaAlumno = (typeof ESTADOS_GUARDAR_PLANTILLA_ALUMNO)[number];
