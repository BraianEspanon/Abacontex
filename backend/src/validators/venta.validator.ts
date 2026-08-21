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

export const obtenerDetalleVentaSchema = z.object({
  params: z.object({
    idVenta: z.coerce.number().int().positive(),
  }),
});

export type ObtenerDetalleVentaParamsDTO = z.infer<typeof obtenerDetalleVentaSchema>['params'];

export const obtenerVentasQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    metodoPagoId: z.coerce.number().int().positive().optional(),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
  }),
});

export type ObtenerVentasQueryDTO = z.infer<typeof obtenerVentasQuerySchema>['query'];
