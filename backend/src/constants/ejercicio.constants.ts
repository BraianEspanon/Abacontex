export const TIPOS_EJERCICIO = [
  'COMPRAS_VENTAS_BASICAS',
  'OPERACIONES_COMERCIALES_INTEGRADAS',
  'AJUSTES_HOJA_TRABAJO',
  'COSTOS_PROCESO_PRODUCTIVO',
] as const;

export type TipoEjercicio = (typeof TIPOS_EJERCICIO)[number];

export const DIFICULTADES_EJERCICIO = ['BASICO', 'INTERMEDIO', 'AVANZADO'] as const;

export type DificultadEjercicio = (typeof DIFICULTADES_EJERCICIO)[number];

export const CONTENIDOS_ADICIONALES = ['IVA', 'INTERESES', 'DESCUENTOS'] as const;

export type ContenidoAdicional = (typeof CONTENIDOS_ADICIONALES)[number];
