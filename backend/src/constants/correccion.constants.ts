export const ESTADOS_CORRECCION_EJERCICIO = [
  'SIN_ENTREGAS',
  'PENDIENTE',
  'EN_CORRECCION',
  'CORREGIDO',
] as const;

export type EstadoCorreccionEjercicio = (typeof ESTADOS_CORRECCION_EJERCICIO)[number];

export const FILTROS_ESTADO_CORRECCION_EJERCICIO = [
  'TODAS',
  'SIN_ENTREGAS',
  'PENDIENTE',
  'EN_CORRECCION',
  'CORREGIDO',
] as const;

export type FiltroEstadoCorreccionEjercicio = (typeof FILTROS_ESTADO_CORRECCION_EJERCICIO)[number];

export const OPCIONES_FILTRO_ESTADO_CORRECCION: readonly {
  clave: FiltroEstadoCorreccionEjercicio;
  label: string;
}[] = [
  { clave: 'TODAS', label: 'Todos' },
  { clave: 'SIN_ENTREGAS', label: 'Sin entregas' },
  { clave: 'PENDIENTE', label: 'Pendientes' },
  { clave: 'EN_CORRECCION', label: 'En corrección' },
  { clave: 'CORREGIDO', label: 'Corregidos' },
] as const;
