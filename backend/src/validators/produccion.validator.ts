import { z } from 'zod';

export const prioridadOrdenProduccionSchema = z.enum(['ALTA', 'MEDIA', 'BAJA']);

export const crearOrdenProduccionSchema = z.object({
  body: z.object({
    productoId: z.coerce.number().int().positive(),
    cantidadProducir: z.coerce.number().int().positive(),
    prioridad: prioridadOrdenProduccionSchema,
    pedidoId: z.coerce.number().int().positive().optional(),
  }),
});

export type CrearOrdenProduccionDTO = z.infer<typeof crearOrdenProduccionSchema>['body'];

export const ordenProduccionIdSchema = z.object({
  params: z.object({
    idOrden: z.coerce.number().int().positive(),
  }),
});

export type OrdenProduccionIdDTO = z.infer<typeof ordenProduccionIdSchema>['params'];
