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

export const obtenerFacturasSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    tipoFactura: z.enum(['A', 'B']).optional(),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    ordenFecha: z.enum(['asc', 'desc']).default('desc').optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerFacturasDTO = z.infer<typeof obtenerFacturasSchema>['query'];
