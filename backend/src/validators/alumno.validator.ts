import { z } from 'zod';

export const completarRegistroSchema = z.object({
  idCurso: z.number().int().positive(),

  idRolEmpresa: z.number().int().positive(),
});
