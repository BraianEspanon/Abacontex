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

export const NOMBRES_PLANTILLAS_LEGIBLES: Record<string, string> = {
  LIBRO_DIARIO: 'Libro diario',
  LIBRO_MAYOR: 'Libro mayor',
  LIBRO_IVA: 'Libro IVA',
  HOJA_TRABAJO: 'Hoja de trabajo',
};

export const NOMBRES_ERRORES_LEGIBLES: Record<string, string> = {
  CUENTA_INCORRECTA: 'Cuenta incorrecta',
  TIPO_MOVIMIENTO_INCORRECTO: 'Tipo de movimiento incorrecto',
  IMPORTE_INCORRECTO: 'Importe incorrecto',
  DEBE_HABER_INVERTIDO: 'Debe / Haber invertido',
  CUENTA_OMITIDA: 'Cuenta omitida / Asiento incompleto',
  CUENTA_ADICIONAL: 'Cuenta adicional',
  CUENTA_MAYORIZAR_OMITIDA: 'Cuenta a mayorizar omitida',
  SALDO_FINAL_INCORRECTO: 'Saldo final incorrecto',
  TIPO_SALDO_INCORRECTO: 'Tipo de saldo incorrecto',
  COMPROBANTE_OMITIDO: 'Comprobante omitido',
  COMPROBANTE_ADICIONAL: 'Comprobante adicional',
  FECHA_INCORRECTA: 'Fecha incorrecta',
  CLASIFICACION_SALDO_INCORRECTA: 'Clasificación de saldo incorrecta',
  RESULTADO_EJERCICIO_INCORRECTO: 'Resultado del ejercicio incorrecto',
  RESULTADO_EJERCICIO_INCOMPLETO: 'Resultado del ejercicio incompleto',
};
