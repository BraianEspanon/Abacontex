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
            
            /* Estilo simple para el checkbox nativo de Keycloak */
            .checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0.2rem 0;
                padding-left: 1rem;
                font-family: 'Outfit', sans-serif;
                color: #F8F6F2;
                font-size: 1.05rem;
                cursor: pointer;
            }
            .checkbox-wrapper input {
                width: 16px;
                height: 16px;
                cursor: pointer;
                accent-color: #5A7956;
            }

            /* Forzamos a que las políticas ocupen una sola línea horizontal compacta */
            .password-policies-box .policy-list {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
                gap: 0.4rem !important;
                width: 100% !important;
                padding: 0 !important;
                margin-top: 0.3rem !important;
            }

            .password-policies-box .policy-item {
                font-size: 0.65rem !important;
                white-space: nowrap !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 0.15rem !important;
            }

            /* Contenedor clave para unificar los elementos y neutralizar el space-around */
            .compact-form-group {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }

            /* Forzamos el alineamiento al centro de todo el bloque derecho */
            .right-panel {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                padding: 2rem !important;
                box-sizing: border-box;
                min-height: 100vh !important;
            }

            /* Eliminamos el div residual vacío de Keycloak que empuja con su margin-top */
            #kc-info, .login-pf-signup {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
            }
        </style>
        Establecer contraseña
    <#elseif section = "form">

    <div class="login-page-wrapper">

        <div class="left-panel">
            <div class="blob-wrapper">
                <img src="${url.resourcesPath}/img/formas.svg" alt="Fondo" class="blob-img"
                     onerror="this.style.display='none'" />
                <img src="${url.resourcesPath}/img/mascota.png" alt="Mascota" class="mascota-img" />
            </div>
        </div>

        <div class="right-panel">
            
            <div style="text-align:center; justify-content: center; flex-direction: column; display: flex; width: 100%; max-width: 700px; margin-bottom: 1rem;">
                <h1 class="login-title" style="margin-top: 0; margin-bottom: 0; max-width:700px; width: 100%; font-size: 3.5rem; margin: 10px 0px;">Reestablecer contraseña</h1>
                <p style="color: #c2c2c2; text-align: center; font-size: 1.1rem; width: 100%; font-family: 'Outfit', sans-serif; letter-spacing: 0; margin: 10px 0px; line-height: 1.3;">
                    Para garantizar la seguridad de tu cuenta, por favor crea tu nueva contraseña de acceso.
                </p>
            </div>

            <div id="kc-form" style="width: 100%; max-width: 480px; margin: 0 auto;">
                <div id="kc-form-wrapper">

                    <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
                        
                        <input type="text" id="username" name="username" value="${username}" autocomplete="username" style="display:none;"/>
                        <input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>

                        <div class="compact-form-group">

                            <div class="field-group" style="margin-bottom: 0;">
                                <label for="password-new">Nueva contraseña</label>
                                <div class="input-wrapper <#if messagesPerField.existsError('password')>has-error</#if>">
                                    <span class="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input tabindex="1" id="password-new" name="password-new" type="password" autocomplete="new-password" placeholder="***********" autofocus />
                                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password-new', 'eye-icon-new')">
                                        <svg id="eye-icon-new" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </button>
                                </div>
                                <#if messagesPerField.existsError('password')>
                                    <span class="field-error-text">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                                </#if>
                            </div>

                            <div class="field-group" style="margin-bottom: 0;">
                                <label for="password-confirm">Confirme la contraseña</label>
                                <div class="input-wrapper <#if messagesPerField.existsError('password-confirm')>has-error</#if>">
                                    <span class="input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input tabindex="2" id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" placeholder="***********" />
                                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password-confirm', 'eye-icon-confirm')">
                                        <svg id="eye-icon-confirm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </button>
                                </div>
                                <#if messagesPerField.existsError('password-confirm')>
                                    <span class="field-error-text">${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}</span>
                                </#if>
                            </div>

                            <#if isAppInitiatedAction??>
                            <#else>
                                <label class="checkbox-wrapper">
                                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" checked />
                                    Cerrar sesión en otros dispositivos
                                </label>
                            </#if>

                            <div class="password-policies-box">
                                <ul class="policy-list">
                                    <li id="req-length" class="policy-item invalid">○ Mínimo 8 caracteres</li>
                                    <li id="req-uppercase" class="policy-item invalid">○ Una Mayúscula</li>
                                    <li id="req-lowercase" class="policy-item invalid">○ Una Minúscula</li>
                                    <li id="req-number" class="policy-item invalid">○ Un Número</li>
                                </ul>
                            </div>

                            <div class="form-actions" style="margin-top: 0.4rem;">
                                <button tabindex="3" type="submit" class="btn-login">
                                    Guardar contraseña
                                </button>
                            </div>

                        </div> 
                    </form>

                </div>
            </div>
            
            <div style="height: 20px; opacity: 0; pointer-events: none;"></div>
        </div>

    </div>

    <script>
        document.getElementById('password-new').addEventListener('input', function() {
            const val = this.value;
            updateRequirement('req-length', val.length >= 8, 'Mínimo 8 carac.');
            updateRequirement('req-uppercase', /[A-Z]/.test(val), '1 Mayúscula');
            updateRequirement('req-lowercase', /[a-z]/.test(val), '1 Minúscula');
            updateRequirement('req-number', /[0-9]/.test(val), '1 Número');
        });

        function updateRequirement(elementId, isValid, text) {
            const el = document.getElementById(elementId);
            if (!el) return;
            if (isValid) {
                el.classList.remove('invalid');
                el.classList.add('valid');
                el.innerHTML = '✓ ' + text;
            } else {
                el.classList.remove('valid');
                el.classList.add('invalid');
                el.innerHTML = '○ ' + text;
            }
        }

        function togglePasswordVisibility(inputId, iconId) {
            const input = document.getElementById(inputId);
            const icon = document.getElementById(iconId);
            if (!input || !icon) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        }
    </script>

    </#if>
</@layout.registrationLayout>