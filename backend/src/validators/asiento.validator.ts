import { MovimientoCuentaContable, TipoOrigenAsiento } from '@prisma/client';
import { z } from 'zod';

export const obtenerPendientesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerPendientesDTO = z.infer<typeof obtenerPendientesSchema>['query'];

export const obtenerDetallePendienteSchema = z.object({
  params: z.object({
    tipo: z.enum(['VENTA', 'MOVIMIENTO_FINANCIERO', 'CONCILIACION_FINANCIERA']),
    id: z.coerce.number().int().positive('ID de operación inválido'),
  }),
});

export type ObtenerDetallePendienteDTO = z.infer<typeof obtenerDetallePendienteSchema>['params'];

export const crearAsientoLineaSchema = z.object({
  cuentaId: z.number().int().positive(),
  movimiento: z.nativeEnum(MovimientoCuentaContable),
  debe: z.number().min(0).default(0),
  haber: z.number().min(0).default(0),
});

export const crearAsientoSchema = z.object({
  body: z.object({
    tipo: z.nativeEnum(TipoOrigenAsiento),
    operacionId: z.number().int().positive('ID de operación inválido'),
    conceptoGeneral: z.string().trim().min(1).max(255),
    detalles: z.array(crearAsientoLineaSchema).min(2),
  }),
});

export type CrearAsientoDTO = z.infer<typeof crearAsientoSchema>['body'];

export const obtenerUltimosAsientosSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(20).default(5),
  }),
});

export type ObtenerUltimosAsientosDTO = z.infer<typeof obtenerUltimosAsientosSchema>['query'];

export const obtenerAsientoPorIdSchema = z.object({
  params: z.object({
    idAsiento: z.coerce.number().int().positive('ID de asiento inválido'),
  }),
});

export type ObtenerAsientoPorIdDTO = z.infer<typeof obtenerAsientoPorIdSchema>['params'];

export const editarAsientoLineaSchema = z.object({
  idDetalle: z.number().int().positive().optional(),
  cuentaId: z.number().int().positive(),
  movimiento: z.nativeEnum(MovimientoCuentaContable),
  debe: z.number().min(0).default(0),
  haber: z.number().min(0).default(0),
});

export const editarAsientoSchema = z.object({
  params: z.object({
    idAsiento: z.coerce.number().int().positive('ID de asiento inválido'),
  }),
  body: z.object({
    detalles: z
      .array(editarAsientoLineaSchema)
      .min(2, 'El asiento debe incluir al menos 2 renglones'),
  }),
});

export type EditarAsientoParamsDTO = z.infer<typeof editarAsientoSchema>['params'];
export type EditarAsientoBodyDTO = z.infer<typeof editarAsientoSchema>['body'];
