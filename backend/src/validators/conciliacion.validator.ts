import { z } from 'zod';

export const registrarConciliacionSchema = z.object({
  body: z.object({
    saldoEsperado: z.coerce.number(),
    saldoContado: z.coerce.number().min(0, 'El saldo contado no puede ser negativo'),
    observacion: z
      .string()
      .trim()
      .max(250, 'La observación no puede superar los 250 caracteres')
      .optional(),
  }),
});

export type RegistrarConciliacionDTO = z.infer<typeof registrarConciliacionSchema>['body'];
