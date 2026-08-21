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
