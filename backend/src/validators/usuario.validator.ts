import { z } from 'zod';

export const actualizarPasswordSchema = z
  .object({
    body: z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }),
  })
  .refine((data) => data.body.currentPassword !== data.body.newPassword, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['newPassword'],
  });
