import { z } from 'zod';
import {
  TIPOS_EJERCICIO,
  DIFICULTADES_EJERCICIO,
  CONTENIDOS_ADICIONALES,
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
