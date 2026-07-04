import { z } from 'zod';
import { ROLES } from '../constants/roles';

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  rol: z.enum([ROLES.ADMIN, ROLES.DOCENTE, ROLES.ALUMNO]),
});

export const actualizarPasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['newPassword'],
  });
