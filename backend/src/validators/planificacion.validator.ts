import { z } from 'zod';

export const detallePlanificacionSchema = z.object({
  mes: z.coerce.number().int().min(1).max(12),
  unidadesEstimadas: z.coerce.number().int().nonnegative(),
});

export const crearPlanificacionSchema = z.object({
  body: z.object({
    mesInicio: z.coerce.number().int().min(1).max(12),
    mesFin: z.coerce.number().int().min(1).max(12),
    detalles: z.array(detallePlanificacionSchema).min(1),
  }),
});

export type CrearPlanificacionDTO = z.infer<typeof crearPlanificacionSchema>['body'];
