export const TIPOS_NOTIFICACION = [
  'EJERCICIO_NUEVO',
  'VENCIMIENTO_PROXIMO',
  'EJERCICIO_CORREGIDO',
] as const;

export type TipoNotificacion = (typeof TIPOS_NOTIFICACION)[number];

