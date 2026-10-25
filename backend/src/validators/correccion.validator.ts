import { z } from 'zod';
import { FILTROS_ESTADO_CORRECCION_EJERCICIO } from '../constants/correccion.constants';

export const obtenerEjerciciosACorregirQuerySchema = z.object({
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
    cursoId: z.coerce
      .number({ message: 'El ID del curso debe ser numérico.' })
      .int('El ID del curso debe ser un número entero.')
      .positive('El ID del curso debe ser mayor a 0.')
      .optional(),
    estado: z.enum(FILTROS_ESTADO_CORRECCION_EJERCICIO).optional().default('TODAS'),
  }),
});

export type ObtenerEjerciciosACorregirQueryDTO = z.infer<
  typeof obtenerEjerciciosACorregirQuerySchema
>['query'];
