import { z } from 'zod';
import { FILTROS_ESTADO_ENTREGA_ALUMNO } from '../constants/entrega.constants';

export const obtenerEntregasAlumnoQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .optional()
      .default(6),
    busqueda: z.string().trim().optional(),
    docenteId: z.string().trim().optional(),
    estado: z.enum(FILTROS_ESTADO_ENTREGA_ALUMNO).optional().default('TODAS'),
  }),
});

export type ObtenerEntregasAlumnoQueryDTO = z.infer<
  typeof obtenerEntregasAlumnoQuerySchema
>['query'];

export const ejercicioIdParamSchema = z.object({
  params: z.object({
    ejercicioId: z.coerce
      .number({ message: 'El ID del ejercicio debe ser numérico.' })
      .int('El ID del ejercicio debe ser un número entero.')
      .positive('El ID del ejercicio debe ser mayor a 0.'),
  }),
});
