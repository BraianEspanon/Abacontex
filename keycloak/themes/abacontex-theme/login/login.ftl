<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo; section>
    <#if section = "header">
        <style>
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
        Iniciar sesión
    <#elseif section = "form">

    <div class="login-page-wrapper">

        <!-- Panel izquierdo: ilustración -->
        <div class="left-panel">
            <div class="blob-wrapper">
                <img src="${url.resourcesPath}/img/formas.svg" alt="Fondo" class="blob-img"
                     onerror="this.style.display='none'" />
                <img src="${url.resourcesPath}/img/mascota.png" alt="Mascota" class="mascota-img" />
            </div>
        </div>

        <!-- Panel derecho: formulario -->
        <div class="right-panel">
            <h1 class="login-title">Iniciar sesión</h1>

            <div id="kc-form">
                <div id="kc-form-wrapper">

                    <#if realm.password>
                    <form id="kc-form-login" onsubmit="login.disabled = true; return true;"
                          action="${url.loginAction}" method="post">

                        <!-- Campo email -->
                        <div class="field-group" <#if usernameEditDisabled?? && usernameEditDisabled>style="opacity: 0.65; pointer-events: none;"</#if>>
                            <label for="username">Correo electrónico</label>
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
                                       placeholder="usuario@mail.com"
                                       value="${(login.username!'')}"
                                       autocomplete="off" 
                                       <#if !(usernameEditDisabled?? && usernameEditDisabled)>autofocus</#if>
                                       <#if usernameEditDisabled?? && usernameEditDisabled>readonly</#if> />
                            </div>
                        </div>

                        <!-- Campo contraseña -->
                        <div class="field-group">
                            <label for="password">Contraseña</label>
                            <div class="input-wrapper">
                                <span class="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input tabindex="2" id="password" name="password" type="password"
                                       placeholder="***********" autocomplete="off" 
                                       <#if usernameEditDisabled?? && usernameEditDisabled>autofocus</#if> />
                                <button type="button" class="toggle-password" onclick="togglePassword()"
                                        aria-label="Mostrar u ocultar contraseña">
                                    <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2"
                                         stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Olvidé mi contraseña -->
                        <#if realm.resetPasswordAllowed>
                        <div class="forgot-password">
                            <a tabindex="5" href="${url.loginResetCredentialsUrl}">¿Olvidaste tu contraseña?</a>
                        </div>
                        </#if>

                        <!-- Mensajes de error -->
                        <#if messagesPerField.existsError('username','password')>
                        <div class="error-message">
                            <span>${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}</span>
                        </div>
                        </#if>

                        <!-- Submit -->
                        <div class="form-actions">
                            <input tabindex="4" type="hidden" id="id-hidden-input" name="credentialId"
                                   <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                            <button tabindex="3" name="login" id="kc-login" type="submit" class="btn-login">
                                Iniciar sesión
                            </button>
                        </div>

                    </form>
                    </#if>

                    <!-- Login social / Google -->
                    <#if social.providers?? && (social.providers?size > 0)>
                    <div class="social-divider">
                        <span></span>
                        <span class="divider-circle">○</span>
                        <span></span>
                    </div>
                    <#list social.providers as p>
                        <#if p.providerId == "google">
                        <a href="${p.loginUrl}" class="btn-google">
                            <img src="${url.resourcesPath}/img/chrome.svg"
                                alt="Chrome"
                                class="google-icon" />
                            Continuar con Google
                        </a>
                        </#if>
                    </#list>
                    </#if>

                    <!-- Link de registro -->
                    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                    <div class="register-link">
                        ¿No tienes cuenta? <a tabindex="6" href="${url.registrationUrl}">Regístrate aquí</a>
                    </div>
                    </#if>

                </div>
            </div>
        </div>

    </div>

    <script>
        function togglePassword() {
            const input = document.getElementById('password');
            const icon = document.getElementById('eye-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        }

        /* Ocultar el header nativo por si el CSS no alcanza */
        document.addEventListener('DOMContentLoaded', function() {
            ['kc-header','kc-header-wrapper'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        });
        
        if (window.location.href.includes('first-broker-login')) {
            var usernameInput = document.getElementById('username');
            var passwordInput = document.getElementById('password');
            var emailGroup = document.getElementById('email-group');

            var forgotPasswordContainer = document.querySelector('.forgot-password');

            if (usernameInput && passwordInput) {
                // Quitamos autofocus general del username
                usernameInput.removeAttribute('autofocus');
                usernameInput.blur();

                // Bloqueamos el campo de email para que sea Readonly y bajamos opacidad
                usernameInput.readOnly = true;
                if (emailGroup) {
                    emailGroup.style.opacity = '0.65';
                    emailGroup.style.pointerEvents = 'none';
                }

                // Forzamos el foco directo a la contraseña con un mini delay para ganarle al render del navegador
                setTimeout(function() {
                    passwordInput.focus();
                }, 50);

                if (forgotPasswordContainer) {
                    forgotPasswordContainer.style.display = 'none';
                }
            }
            
        };
    </script>

    </#if>
</@layout.registrationLayout>
