import { z } from 'zod';

export const completarRegistroSchema = z.object({
  body: z.object({
    idCurso: z.number().int().positive(),

    idRolEmpresa: z.number().int().positive(),
  }),
});

export const actualizarUsuarioSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),

    apellido: z.string().trim().min(1, 'El apellido es obligatorio').max(100),
  }),
});
