import { z } from 'zod';

export const actualizarPasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),

      newPassword: z
        .string()
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .regex(/[a-z]/, 'La nueva contraseña debe contener al menos una letra minúscula')
        .regex(/[A-Z]/, 'La nueva contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La nueva contraseña debe contener al menos un número'),
    })
    .superRefine((data, ctx) => {
      if (data.currentPassword === data.newPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['newPassword'],
          message: 'La nueva contraseña debe ser distinta a la actual',
        });
      }
    }),
});

export type ActualizarContraseñaDTO = z.infer<typeof actualizarPasswordSchema>['body'];

export const actualizarUsuarioSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),

    apellido: z.string().trim().min(1, 'El apellido es obligatorio').max(100),

    eliminarFoto: z.coerce.boolean().optional(),
  }),
});

export type ActualizarUsuarioDTO = z.infer<typeof actualizarUsuarioSchema>['body'];
