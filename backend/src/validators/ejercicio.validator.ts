import { z } from 'zod';
import {
  TIPOS_EJERCICIO,
  DIFICULTADES_EJERCICIO,
  CONTENIDOS_ADICIONALES,
  TIPOS_PLANTILLA,
} from '../constants/ejercicio.constants';

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
    estado: z.enum(['BORRADOR', 'PUBLICADO']).optional().default('BORRADOR'),
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
