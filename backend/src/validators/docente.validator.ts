import { z } from 'zod';

export const crearDocenteSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),

    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),

    email: z.email('El correo electrónico no es válido'),

    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),

    cursoIds: z.array(z.number().int().positive()).min(1, 'Debe seleccionar al menos un curso'),
  }),
});
