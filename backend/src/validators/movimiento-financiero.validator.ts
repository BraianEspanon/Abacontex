import { z } from 'zod';

export const registrarMovimientoSchema = z.object({
  body: z.object({
    fecha: z.string().datetime('La fecha es obligatoria y debe ser válida'),
    idCategoria: z.number().int().positive(),
    concepto: z.string().trim().min(1, 'El concepto es obligatorio'),
    importe: z.number().positive('El importe debe ser mayor a cero'),
    idMetodoPago: z.number().int().positive(),

    observaciones: z.string().trim().optional(),
  }),
});

export type RegistrarMovimientoDTO = z.infer<typeof registrarMovimientoSchema>['body'];

export const consultarHistorialSchema = z.object({
  query: z.object({
    mes: z.coerce.number().int().min(1).max(12).optional(),
    idTipoMovimiento: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
  }),
});

export type ConsultarHistorialDTO = z.infer<typeof consultarHistorialSchema>['query'];
