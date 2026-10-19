import { z } from 'zod';
import {
  ESTADOS_GUARDAR_PLANTILLA_ALUMNO,
  FILTROS_ESTADO_ENTREGA_ALUMNO,
} from '../constants/entrega.constants';
import {
  hojaTrabajoContenidoSchema,
  libroDiarioContenidoSchema,
  libroIvaContenidoSchema,
  libroMayorContenidoSchema,
} from './resolucion-plantillas.validator';

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

export type EjercicioIdParamDTO = z.infer<typeof ejercicioIdParamSchema>['params'];

export const guardarPlantillaAlumnoBodySchema = z.discriminatedUnion('tipo', [
  z
    .object({
      tipo: z.literal('LIBRO_DIARIO'),
      estado: z.enum(ESTADOS_GUARDAR_PLANTILLA_ALUMNO).optional().default('EN_EDICION'),
      contenido: libroDiarioContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('LIBRO_MAYOR'),
      estado: z.enum(ESTADOS_GUARDAR_PLANTILLA_ALUMNO).optional().default('EN_EDICION'),
      contenido: libroMayorContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('LIBRO_IVA'),
      estado: z.enum(ESTADOS_GUARDAR_PLANTILLA_ALUMNO).optional().default('EN_EDICION'),
      contenido: libroIvaContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('HOJA_TRABAJO'),
      estado: z.enum(ESTADOS_GUARDAR_PLANTILLA_ALUMNO).optional().default('EN_EDICION'),
      contenido: hojaTrabajoContenidoSchema,
    })
    .strict(),
]);

export type GuardarPlantillaAlumnoBodyDTO = z.infer<typeof guardarPlantillaAlumnoBodySchema>;

export const guardarPlantillaAlumnoSchema = ejercicioIdParamSchema.extend({
  body: guardarPlantillaAlumnoBodySchema,
});

export type GuardarPlantillaAlumnoParamsDTO = EjercicioIdParamDTO;
