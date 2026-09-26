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

export const ESTADOS_EJERCICIO = ['BORRADOR', 'PUBLICADO', 'FINALIZADO'] as const;

export type EstadoEjercicio = (typeof ESTADOS_EJERCICIO)[number];

export const TIPOS_PLANTILLA = [
  'LIBRO_DIARIO',
  'LIBRO_MAYOR',
  'LIBRO_IVA',
  'HOJA_TRABAJO',
] as const;

export type TipoPlantilla = (typeof TIPOS_PLANTILLA)[number];

export interface OpcionTipoEjercicio {
  id: TipoEjercicio;
  label: string;
  permiteContenidosAdicionales: boolean;
}

export interface OpcionDificultad {
  id: DificultadEjercicio;
  label: string;
}

export interface OpcionContenidoAdicional {
  id: ContenidoAdicional;
  label: string;
}

export const OPCIONES_TIPOS_EJERCICIO: readonly OpcionTipoEjercicio[] = [
  {
    id: 'COMPRAS_VENTAS_BASICAS',
    label: 'Compras y ventas básicas',
    permiteContenidosAdicionales: true,
  },
  {
    id: 'OPERACIONES_COMERCIALES_INTEGRADAS',
    label: 'Operaciones comerciales integradas',
    permiteContenidosAdicionales: false,
  },
  {
    id: 'AJUSTES_HOJA_TRABAJO',
    label: 'Ajustes y Hoja de Trabajo',
    permiteContenidosAdicionales: false,
  },
  {
    id: 'COSTOS_PROCESO_PRODUCTIVO',
    label: 'Costos y proceso productivo',
    permiteContenidosAdicionales: false,
  },
] as const;

export const OPCIONES_DIFICULTADES: readonly OpcionDificultad[] = [
  { id: 'BASICO', label: 'Básico (~4 operaciones)' },
  { id: 'INTERMEDIO', label: 'Intermedio (~6 operaciones)' },
  { id: 'AVANZADO', label: 'Avanzado (~10 operaciones)' },
] as const;

export const OPCIONES_CONTENIDOS_ADICIONALES: readonly OpcionContenidoAdicional[] = [
  { id: 'IVA', label: 'Incluir IVA (21%)' },
  { id: 'INTERESES', label: 'Incluir intereses de financiación' },
  { id: 'DESCUENTOS', label: 'Incluir descuentos / bonificaciones' },
] as const;
