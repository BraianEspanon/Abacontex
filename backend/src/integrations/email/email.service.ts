import { transporter } from './email.client';

import { welcomeEmailTemplate } from './templates/welcome-email.template';
import { invitationEmailTemplate } from './templates/invitation-email.template';

import { getRegistrationUrl } from '../../utils/keycloak.util';

export async function sendWelcomeEmail(to: string, nombre: string): Promise<void> {
  await transporter.sendMail({
    from: {
      name: process.env.SMTP_FROM_NAME!,
      address: process.env.SMTP_FROM!,
    },

    to,

    subject: '¡Bienvenido a Abacontex!',

    html: welcomeEmailTemplate(nombre),
  });
}

export async function sendInvitationEmail(
  to: string,
  empresa: string,
  fechaExpiracion: Date
): Promise<void> {
  await transporter.sendMail({
    from: {
      name: process.env.SMTP_FROM_NAME!,
      address: process.env.SMTP_FROM!,
    },

    to,

    subject: `Has sido invitado a unirte a ${empresa}`,

    html: invitationEmailTemplate(empresa, to, fechaExpiracion, getRegistrationUrl(to)),
  });
}
