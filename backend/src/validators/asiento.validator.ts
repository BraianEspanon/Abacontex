import { z } from 'zod';

export const obtenerPendientesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerPendientesDTO = z.infer<typeof obtenerPendientesSchema>['query'];

export const obtenerDetallePendienteSchema = z.object({
  params: z.object({
    tipo: z.enum(['VENTA', 'MOVIMIENTO_FINANCIERO', 'CONCILIACION_FINANCIERA']),
    id: z.coerce.number().int().positive('ID de operación inválido'),
  }),
});

export type ObtenerDetallePendienteDTO = z.infer<typeof obtenerDetallePendienteSchema>['params'];
