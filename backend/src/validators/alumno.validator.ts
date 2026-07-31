import { z } from 'zod';

export const completarRegistroSchema = z.object({
  body: z.object({
    idCurso: z.number().int().positive().optional(),

    idRolEmpresa: z.number().int().positive(),
  }),
});

export type CompletarRegistroDTO = z.infer<typeof completarRegistroSchema>['body'];
