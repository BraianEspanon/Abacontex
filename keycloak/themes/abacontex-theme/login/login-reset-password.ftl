<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        <style>
            /* Hereda los resets globales para pantalla completa */
            #kc-header, #kc-header-wrapper, .login-pf-header,
            header, nav, .navbar, .navbar-pf, [class*="navbar"],
            .pf-c-page__header, .pf-v5-c-page__header {
                display: none !important;
                height: 0 !important;
            }
            body, body.login-pf { margin: 0 !important; padding: 0 !important; }
            #kc-container, #kc-container-wrapper,
            .container-fluid, .row, .card-pf, .login-pf-page .card-pf {
                all: unset !important;
                display: contents !important;
            }
        </style>
        Recuperar contraseña
    <#elseif section = "form">

    <div class="login-page-wrapper">

        <!-- Panel izquierdo: Ilustración de Abacontex -->
        <div class="left-panel">
            <div class="blob-wrapper">
                <img src="${url.resourcesPath}/img/formas.svg" alt="Fondo" class="blob-img"
                     onerror="this.style.display='none'" />
                <img src="${url.resourcesPath}/img/mascota.png" alt="Mascota" class="mascota-img" />
            </div>
        </div>

        <!-- Panel derecho: Formulario de recuperación -->
        <div class="right-panel">
            <h1 class="login-title" style="margin-bottom: 0.5rem;">¿Olvidaste tu contraseña?</h1>
            
            <p style="color: #c2c2c2; text-align: center; margin-bottom: 2rem; font-size: 1.1rem; max-width: 400px; font-family: 'Outfit', sans-serif; letter-spacing: 0;">
                Introduce tu correo electrónico o usuario y te enviaremos las instrucciones para generar una nueva contraseña.
            </p>

            <div id="kc-form">
                <div id="kc-form-wrapper">

                    <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
                        
                        <!-- Campo Email / Usuario -->
                        <div class="field-group">
                            <label for="username"><#if !realm.loginWithEmailAllowed>Usuario<#elseif !realm.registrationEmailAsUsername>Usuario o correo electrónico<#else>Correo electrónico</#if></label>
                            <div class="input-wrapper">
                                <span class="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </span>
                                <input tabindex="1" id="username" name="username" type="text" 
                                       placeholder="usuario@ipgsanmartin.edu.ar" 
                                       value="${(auth.attemptedUsername!'')}" 
                                       autofocus autocomplete="off" />
                            </div>
                        </div>

                        <!-- Submit -->
                        <div class="form-actions" style="margin-top: 2rem;">
                            <button tabindex="2" type="submit" class="btn-login">
                                Enviar instrucciones
                            </button>
                        </div>

                        <!-- Volver al Login (Al pie del formulario, igual que en registro) -->
                        <div class="back-to-home" style="margin-top: 1.5rem;">
                            <a href="${url.loginUrl}"><span class="arrow-style">|←</span> Volver al inicio</a>
                        </div>

                    </form>

                </div>
            </div>
        </div>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            /* Forzar el ocultamiento de headers nativos residuales si existieran */
            ['kc-header','kc-header-wrapper'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        });
    </script>

    </#if>
</@layout.registrationLayout>