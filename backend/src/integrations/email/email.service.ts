import { transporter } from './email.client';

import { welcomeEmailTemplate } from './templates/welcome-email.template';

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
