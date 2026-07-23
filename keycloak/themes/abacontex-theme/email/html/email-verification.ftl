<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
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
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #5A7956;
            padding: 30px;
            text-align: center;
            color: #ffffff;
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
            background-color: #5A7956;
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #999999;
            font-size: 12px;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">
            <h1>¡Bienvenido a Abacontex!</h1>
        </div>
        
        <div class="content">
            <p>Hola,</p>
            <p>Gracias por registrarte en <strong>Abacontex</strong>. Para completar la creación de tu cuenta y poder iniciar sesión, necesitamos que verifiques tu dirección de correo electrónico.</p>
            
            <div class="button-container">
                <!-- La variable ${link} es inyectada automáticamente por Keycloak -->
                <a href="${link}" class="btn">Verificar mi correo</a>
            </div>
            
            <!-- La variable ${linkExpiration} te da el tiempo en minutos -->
            <p style="font-size: 14px; color: #666;">
                Este enlace de verificación expirará en <strong>${linkExpiration} minutos</strong>.
            </p>
            
            <p>Si tú no creaste esta cuenta, por favor ignora este mensaje.</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${.now?string('yyyy')} Abacontex. Todos los derechos reservados.</p>
        </div>
    </div>

</body>
</html>