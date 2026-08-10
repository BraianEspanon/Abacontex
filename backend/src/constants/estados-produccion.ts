export const ESTADOS_PRODUCCION = {
  PENDIENTE: 'Pendientes',
  EN_PRODUCCION: 'En Producción',
  FINALIZADA: 'Finalizadas',
} as const;

export type EstadoProduccion = (typeof ESTADOS_PRODUCCION)[keyof typeof ESTADOS_PRODUCCION];
