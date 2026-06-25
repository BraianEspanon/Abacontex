import { z } from 'zod';
import { ROLES } from '../constants/roles';

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  rol: z.enum([
    ROLES.ADMIN,
    ROLES.DOCENTE,
    ROLES.ALUMNO,
  ]),
});