import { z } from 'zod';

export const obtenerVentasPendientesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerVentasPendientesDTO = z.infer<typeof obtenerVentasPendientesSchema>['query'];
