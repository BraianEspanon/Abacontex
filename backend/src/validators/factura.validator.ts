import { z } from 'zod';

export const obtenerVentasPendientesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerVentasPendientesDTO = z.infer<typeof obtenerVentasPendientesSchema>['query'];

export const generarFacturaSchema = z.object({
  body: z.object({
    ventaId: z.number().int().positive(),
    tipoFactura: z.enum(['A', 'B']),
    condicionFiscal: z.enum(['RESPONSABLE_INSCRIPTO', 'CONSUMIDOR_FINAL']),
  }),
});

export type GenerarFacturaDTO = z.infer<typeof generarFacturaSchema>['body'];

export const obtenerDetalleFacturaSchema = z.object({
  params: z.object({
    idFactura: z.coerce.number().int().positive(),
  }),
});

export type ObtenerDetalleFacturaParamsDTO = z.infer<typeof obtenerDetalleFacturaSchema>['params'];
