import { z } from 'zod';

export const registrarVentaSchema = z.object({
  body: z
    .object({
      pedidoId: z.number().int().positive(),

      metodoPagoId: z.number().int().positive(),

      cantidadCuotas: z
        .union([
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(6),
          z.literal(9),
          z.literal(12),
          z.literal(18),
          z.literal(24),
        ])
        .nullable(),

      tipoAjuste: z.enum(['NINGUNO', 'DESCUENTO', 'RECARGO']),

      porcentajeAjuste: z.number().min(0).max(100),

      aplicaIva: z.boolean(),

      porcentajeInteres: z.number().min(0).max(100),
    })
    .superRefine((data, ctx) => {
      if (data.tipoAjuste === 'NINGUNO' && data.porcentajeAjuste !== 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['porcentajeAjuste'],
          message: 'El porcentaje de ajuste debe ser 0 cuando no hay descuento ni recargo.',
        });
      }

      if (data.tipoAjuste !== 'NINGUNO' && data.porcentajeAjuste === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['porcentajeAjuste'],
          message:
            'El porcentaje de ajuste debe ser mayor a 0 cuando se selecciona descuento o recargo.',
        });
      }
    }),
});

export type RegistrarVentaDTO = z.infer<typeof registrarVentaSchema>['body'];
