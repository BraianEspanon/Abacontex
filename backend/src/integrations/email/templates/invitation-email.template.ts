export function invitationEmailTemplate(
  empresa: string,
  email: string,
  fechaExpiracion: Date,
  url: string
): string {
  const fecha = fechaExpiracion.toLocaleDateString('es-AR');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Invitación a Abacontex</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .header {
            background-color: #5A7956;
            color: white;
            text-align: center;
            padding: 30px;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
          }

          .button-container {
            text-align: center;
            margin: 30px 0;
          }

          .btn {
            display: inline-block;
            background-color: #5A7956;
            color: white !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
          }

          .important {
            background: #f8f8f8;
            border-left: 4px solid #5A7956;
            padding: 15px;
            margin: 25px 0;
          }

          .footer {
            background: #f9f9f9;
            border-top: 1px solid #eeeeee;
            padding: 20px;
            text-align: center;
            color: #999999;
            font-size: 12px;
          }

          ol {
            padding-left: 20px;
          }
        </style>
      </head>

      <body>

        <div class="email-container">

          <div class="header">
            <h1>¡Has recibido una invitación!</h1>
          </div>

          <div class="content">

            <p>
              La empresa <strong>${empresa}</strong> te ha invitado a formar parte de su equipo en <strong>Abacontex</strong>.
            </p>

            <p>
              Si todavía no tienes una cuenta, sigue estos pasos:
            </p>

            <ol>
              <li>Ingresa a Abacontex.</li>
              <li>Regístrate utilizando el correo <strong>${email}</strong>.</li>
              <li>Completa tu registro como alumno.</li>
              <li>Encontrarás esta invitación pendiente dentro de la aplicación para aceptarla.</li>
            </ol>

            <p>
              Si ya tienes una cuenta, simplemente inicia sesión con este mismo correo electrónico.
            </p>

            <div class="button-container">
              <a href="${url}" class="btn">
                Ir a Abacontex
              </a>
            </div>

            <div class="important">
              <strong>Importante</strong>

              <ul>
                <li>Utiliza el mismo correo electrónico al registrarte.</li>
                <li>La invitación vencerá el <strong>${fecha}</strong>.</li>
              </ul>
            </div>

            <p>
              Si no esperabas este correo, puedes ignorarlo sin realizar ninguna acción.
            </p>

          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Abacontex. Todos los derechos reservados.
          </div>

        </div>

      </body>
    </html>
  `;
}
