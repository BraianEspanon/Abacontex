import { z } from 'zod';

export const ESTADOS_FILTRO_NOTIFICACION = ['TODAS', 'NO_LEIDAS', 'LEIDAS'] as const;
export type EstadoFiltroNotificacion = (typeof ESTADOS_FILTRO_NOTIFICACION)[number];

export const obtenerNotificacionesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').default(1),

    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .default(10),

    estado: z
      .enum(ESTADOS_FILTRO_NOTIFICACION, 'El estado debe ser TODAS, NO_LEIDAS o LEIDAS.')
      .default('TODAS'),
  }),
});

export type ObtenerNotificacionesQueryDTO = z.infer<
  typeof obtenerNotificacionesQuerySchema
>['query'];
