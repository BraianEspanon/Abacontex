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

export const ESTADOS_CORRECCION_ALUMNO = [
  'SIN_ENTREGAR',
  'PENDIENTE',
  'EN_CORRECCION',
  'CORREGIDA',
] as const;

export type EstadoCorreccionAlumno = (typeof ESTADOS_CORRECCION_ALUMNO)[number];

export const FILTROS_ESTADO_CORRECCION_ALUMNO = [
  'TODAS',
  'SIN_ENTREGAR',
  'PENDIENTE',
  'EN_CORRECCION',
  'CORREGIDA',
] as const;

export type FiltroEstadoCorreccionAlumno = (typeof FILTROS_ESTADO_CORRECCION_ALUMNO)[number];

export const OPCIONES_FILTRO_ESTADO_CORRECCION_ALUMNO: readonly {
  clave: FiltroEstadoCorreccionAlumno;
  label: string;
}[] = [
  { clave: 'TODAS', label: 'Todos' },
  { clave: 'SIN_ENTREGAR', label: 'Sin entregar' },
  { clave: 'PENDIENTE', label: 'Pendientes' },
  { clave: 'EN_CORRECCION', label: 'En corrección' },
  { clave: 'CORREGIDA', label: 'Corregidas' },
] as const;
