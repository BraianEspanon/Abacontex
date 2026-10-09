import { z } from 'zod';
import {
  TIPOS_EJERCICIO,
  DIFICULTADES_EJERCICIO,
  CONTENIDOS_ADICIONALES,
  TIPOS_PLANTILLA,
  FILTROS_ESTADO_EJERCICIO,
  ESTADOS_GUARDAR_EJERCICIO,
  ESTADOS_GUARDAR_RESOLUCION,
} from '../constants/ejercicio.constants';
import {
  hojaTrabajoContenidoSchema,
  libroDiarioContenidoSchema,
  libroIvaContenidoSchema,
  libroMayorContenidoSchema,
} from './resolucion-plantillas.validator';

export const generarEjercicioSchema = z.object({
  body: z.object({
    cursoId: z.coerce.number().int().positive({
      message: 'El curso es obligatorio y debe ser un ID válido.',
    }),
    tipoEjercicio: z.enum(TIPOS_EJERCICIO, {
      message: 'Tipo de ejercicio no válido.',
    }),
    dificultad: z.enum(DIFICULTADES_EJERCICIO, {
      message: 'Dificultad no válida.',
    }),
    contenidosAdicionales: z.array(z.enum(CONTENIDOS_ADICIONALES)).optional().default([]),
    contextoAdicional: z
      .string()
      .trim()
      .max(200, 'El contexto adicional no puede superar los 200 caracteres.')
      .optional(),
  }),
});

export type GenerarEjercicioDTO = z.infer<typeof generarEjercicioSchema>['body'];

export const crearEjercicioSchema = z.object({
  body: z.object({
    titulo: z
      .string('El título es obligatorio.')
      .trim()
      .min(1, 'El título no puede estar vacío.')
      .max(100, 'El título no puede superar los 100 caracteres.'),
    cursoId: z.coerce
      .number('El curso es obligatorio.')
      .int()
      .positive('El ID del curso debe ser válido.'),
    enunciado: z
      .string('El enunciado es obligatorio.')
      .trim()
      .min(1, 'El enunciado no puede estar vacío.'),
    fechaLimite: z
      .string('La fecha límite es obligatoria.')
      .datetime({ message: 'La fecha límite debe ser una fecha y hora ISO válida.' }),
    indicaciones: z
      .string()
      .trim()
      .max(200, 'Las indicaciones no pueden superar los 200 caracteres.')
      .optional()
      .nullable(),
    estado: z.enum(ESTADOS_GUARDAR_EJERCICIO).optional().default('BORRADOR'),
    plantillas: z
      .array(z.enum(TIPOS_PLANTILLA))
      .min(1, 'Debe seleccionar al menos una plantilla.')
      .refine((items) => new Set(items).size === items.length, {
        message: 'No puede incluir plantillas duplicadas.',
      }),
    generacionIA: z
      .object({
        tipoEjercicio: z.enum(TIPOS_EJERCICIO, {
          message: 'Tipo de ejercicio no válido.',
        }),
        dificultad: z.enum(DIFICULTADES_EJERCICIO, {
          message: 'Dificultad no válida.',
        }),
        contextoAdicional: z
          .string()
          .trim()
          .max(200, 'El contexto adicional no puede superar los 200 caracteres.')
          .optional()
          .nullable(),
        contenidos: z.array(z.enum(CONTENIDOS_ADICIONALES)).optional().default([]),
      })
      .optional()
      .nullable(),
  }),
});

export type CrearEjercicioDTO = z.infer<typeof crearEjercicioSchema>['body'];

export const obtenerEjerciciosQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .optional()
      .default(6),
    cursoId: z.coerce.number().int().positive('ID de curso inválido.').optional(),
    titulo: z.string().trim().optional(),
    estado: z.enum(FILTROS_ESTADO_EJERCICIO).optional(),
  }),
});

export type ObtenerEjerciciosQueryDTO = z.infer<typeof obtenerEjerciciosQuerySchema>['query'];

export const obtenerEjercicioPorIdSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID del ejercicio debe ser numérico.' })
      .int('El ID del ejercicio debe ser un número entero.')
      .positive('El ID del ejercicio debe ser mayor a cero.'),
  }),
});

export type ObtenerEjercicioPorIdParamsDTO = z.infer<typeof obtenerEjercicioPorIdSchema>['params'];

export const editarEjercicioSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID del ejercicio debe ser numérico.' })
      .int('El ID del ejercicio debe ser un número entero.')
      .positive('El ID del ejercicio debe ser mayor a cero.'),
  }),
  body: z
    .object({
      titulo: z
        .string()
        .trim()
        .min(1, 'El título no puede estar vacío.')
        .max(100, 'El título no puede superar los 100 caracteres.')
        .optional(),
      cursoId: z.coerce.number().int().positive('El ID del curso debe ser válido.').optional(),
      enunciado: z.string().trim().min(1, 'El enunciado no puede estar vacío.').optional(),
      fechaLimite: z
        .string()
        .datetime({ message: 'La fecha límite debe ser una fecha y hora ISO válida.' })
        .optional(),
      indicaciones: z
        .string()
        .trim()
        .max(200, 'Las indicaciones no pueden superar los 200 caracteres.')
        .optional()
        .nullable(),
      estado: z.enum(ESTADOS_GUARDAR_EJERCICIO).optional(),
      plantillas: z
        .array(z.enum(TIPOS_PLANTILLA))
        .min(1, 'Debe seleccionar al menos una plantilla.')
        .refine((items) => new Set(items).size === items.length, {
          message: 'No puede incluir plantillas duplicadas.',
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Debe enviar al menos un campo para actualizar.',
    }),
});

export type EditarEjercicioParamsDTO = z.infer<typeof editarEjercicioSchema>['params'];
export type EditarEjercicioBodyDTO = z.infer<typeof editarEjercicioSchema>['body'];

export const consultarResolucionDocenteSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID del ejercicio debe ser numérico.' })
      .int('El ID del ejercicio debe ser un número entero.')
      .positive('El ID del ejercicio debe ser mayor a cero.'),
  }),
});

export type ConsultarResolucionDocenteParamsDTO = z.infer<
  typeof consultarResolucionDocenteSchema
>['params'];

export const actualizarResolucionDocenteBodySchema = z.discriminatedUnion('tipo', [
  z
    .object({
      tipo: z.literal('LIBRO_DIARIO'),
      estado: z.enum(ESTADOS_GUARDAR_RESOLUCION).optional().default('EN_EDICION'),
      contenido: libroDiarioContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('LIBRO_MAYOR'),
      estado: z.enum(ESTADOS_GUARDAR_RESOLUCION).optional().default('EN_EDICION'),
      contenido: libroMayorContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('LIBRO_IVA'),
      estado: z.enum(ESTADOS_GUARDAR_RESOLUCION).optional().default('EN_EDICION'),
      contenido: libroIvaContenidoSchema,
    })
    .strict(),
  z
    .object({
      tipo: z.literal('HOJA_TRABAJO'),
      estado: z.enum(ESTADOS_GUARDAR_RESOLUCION).optional().default('EN_EDICION'),
      contenido: hojaTrabajoContenidoSchema,
    })
    .strict(),
]);

export const actualizarResolucionDocenteSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID del ejercicio debe ser numérico.' })
      .int('El ID del ejercicio debe ser un número entero.')
      .positive('El ID del ejercicio debe ser mayor a cero.'),
  }),
  body: actualizarResolucionDocenteBodySchema,
});

export type ActualizarResolucionDocenteParamsDTO = z.infer<
  typeof actualizarResolucionDocenteSchema
>['params'];
export type ActualizarResolucionDocenteBodyDTO = z.infer<
  typeof actualizarResolucionDocenteSchema
>['body'];
