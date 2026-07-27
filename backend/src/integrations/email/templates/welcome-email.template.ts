export function welcomeEmailTemplate(nombre: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Bienvenido a Abacontex</title>
      </head>

      <body
        style="
          margin:0;
          padding:40px;
          font-family:Arial, Helvetica, sans-serif;
          background:#f5f5f5;
        "
      >

        <div
          style="
            max-width:600px;
            margin:auto;
            background:white;
            border-radius:12px;
            padding:40px;
          "
        >

          <h1
            style="
              color:#5A7956;
              margin-top:0;
            "
          >
            ¡Bienvenido a Abacontex!
          </h1>

          <p>
            Hola <strong>${nombre}</strong>.
          </p>

          <p>
            Tu cuenta fue creada correctamente.
          </p>

          <p>
            Ya podés iniciar sesión utilizando tu correo electrónico.
          </p>

          <p>
            ¡Te damos la bienvenida!
          </p>

          <hr>

          <small style="color:#777">
            Equipo Abacontex
          </small>

        </div>

      </body>
    </html>
  `;
}
