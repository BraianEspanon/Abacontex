import { z } from 'zod';

export const digitalizarEjercicioSchema = z.object({
  body: z.object({
    cursoId: z.coerce.number().int().positive().optional(),
  }),
});

export type DigitalizarEjercicioDTO = z.infer<typeof digitalizarEjercicioSchema>['body'];

export const digitalizarEjercicioResponseSchema = z.object({
  enunciadoTexto: z.string().min(1, 'El texto digitalizado no puede estar vacío.'),
});

export type DigitalizarEjercicioResponseDTO = z.infer<typeof digitalizarEjercicioResponseSchema>;
