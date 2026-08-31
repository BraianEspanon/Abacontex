import { z } from 'zod';

export const obtenerPendientesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerPendientesDTO = z.infer<typeof obtenerPendientesSchema>['query'];
