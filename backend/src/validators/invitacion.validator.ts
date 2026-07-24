import { z } from 'zod';

export const crearInvitacionesSchema = z.object({
  body: z.object({
    emails: z
      .array(z.email())
      .min(1, 'Debe ingresar al menos un correo')
      .max(10, 'No puede invitar más de 10 personas a la vez')
      .refine((emails) => new Set(emails).size === emails.length, {
        message: 'No puede enviar correos duplicados.',
      }),
  }),
});

export type CrearInvitacionesDTO = z.infer<typeof crearInvitacionesSchema>['body'];
