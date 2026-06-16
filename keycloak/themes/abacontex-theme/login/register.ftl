<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=messagesPerField.existsError('firstName','lastName','email','password','password-confirm'); section>
    <#if section = "header">
        <style>
            /* Hereda los mismos resets que ya tienes en login */
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
        Crea tu cuenta
    <#elseif section = "form">

    <div class="login-page-wrapper">
    
        <div class="left-panel">
            <div class="blob-wrapper">
                <div class="left-panel-text-wrapper">
                    <h1 class="register-main-title">Crea tu cuenta</h1>
                    <p class="register-subtitle">Regístrate y empezá a<br>gestionar tu empresa hoy</p>
                </div>
                <img src="${url.resourcesPath}/img/formas.svg" alt="Fondo" class="blob-img"
                     onerror="this.style.display='none'" />
                <img src="${url.resourcesPath}/img/mascota.png" alt="Mascota" class="mascota-img register-mascota" />
            </div>
        </div>

        <div class="right-panel">
        
            <div>
                <div class="stepper-container">
                    <div class="step active">1</div>
                    <div class="step-line line-left-active"></div>
                    <div class="step-line line-right-inactive"></div>
                    <div class="step step-two">2</div>
                </div>

                <div class="register-link">
                    ¿Ya tienes cuenta? <a href="${url.loginUrl}">Iniciar sesión</a>
                </div>
            </div>

            <div id="kc-form">
                <div id="kc-form-wrapper">

                    <form id="kc-register-form" action="${url.registrationAction}" method="post">
                        
                        <div class="field-row-grid">
                            <div class="field-group">
                                <label for="firstName">Nombre</label>
                                <div class="input-wrapper <#if messagesPerField.existsError('firstName')>has-error</#if>">
                                    <input tabindex="1" id="firstName" name="firstName" type="text" placeholder="nombre" value="${(register.formData.firstName!'')}" maxlength="50"/>
                                </div>
                                <#if messagesPerField.existsError('firstName')>
                                    <span class="field-error-text">${kcSanitize(messagesPerField.get('firstName'))?no_esc}</span>
                                </#if>
                            </div>

                            <div class="field-group">
                                <label for="lastName">Apellido</label>
                                <div class="input-wrapper <#if messagesPerField.existsError('lastName')>has-error</#if>">
                                    <input tabindex="2" id="lastName" name="lastName" type="text" placeholder="apellido" value="${(register.formData.lastName!'')}"  maxlength="50" />
                                </div>
                                <#if messagesPerField.existsError('lastName')>
                                    <span class="field-error-text">${kcSanitize(messagesPerField.get('lastName'))?no_esc}</span>
                                </#if>
                            </div>
                        </div>

                        <div class="field-group">
                            <label for="email">Correo electrónico</label>
                            <div class="input-wrapper <#if messagesPerField.existsError('email')>has-error</#if>">
                                <input tabindex="3" id="email" name="email" type="email" placeholder="agus@mail.com" value="${(register.formData.email!'')}"  maxlength="254"/>
                            </div>
                            <#if messagesPerField.existsError('email')>
                                <span class="field-error-text">${kcSanitize(messagesPerField.get('email'))?no_esc}</span>
                            </#if>
                        </div>

                        <div class="field-group">
                            <label for="password">Contraseña</label>
                            <div class="input-wrapper <#if messagesPerField.existsError('password')>has-error</#if>">
                                <input tabindex="4" id="password" name="password" type="password" placeholder="***********" autocomplete="new-password" maxlength="64" />
                                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password', 'eye-icon-main')">
                                    <svg id="eye-icon-main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </button>
                            </div>
                            <#if messagesPerField.existsError('password')>
                                <span class="field-error-text">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                            </#if>
                        </div>

                        <div class="password-policies-box">
                            <p class="policy-title">La contraseña debe incluir:</p>
                            <ul class="policy-list">
                                <li id="req-length" class="policy-item invalid">○ Mínimo 8 caracteres</li>
                                <li id="req-uppercase" class="policy-item invalid">○ Una mayúscula</li>
                                <li id="req-lowercase" class="policy-item invalid">○ Una minúscula</li>
                                <li id="req-number" class="policy-item invalid">○ Un número</li>
                            </ul>
                        </div>

                        <input type="hidden"
                            name="password-confirm"
                            id="password-confirm">
                        
                        <div class="form-actions register-actions">
                            <button tabindex="6" id="kc-register" type="submit" class="btn-login btn-register">
                                Crear mi cuenta <span class="arrow-style">|→</span>
                            </button>
                        </div>

                        <div class="back-to-home">
                            <a href="${url.loginUrl}"><span class="arrow-style">|←</span> Volver al inicio</a>
                        </div>

                    </form>

                </div>
            </div>
        </div>

    </div>
    </#if>
</@layout.registrationLayout>

<script>
    document.getElementById('password').addEventListener('input', function() {
        const val = this.value;
        
        // 1. Validar longitud (Mínimo 8)
        updateRequirement('req-length', val.length >= 8);
        
        // 2. Validar mayúscula
        updateRequirement('req-uppercase', /[A-Z]/.test(val));
        
        // 3. Validar minúscula
        updateRequirement('req-lowercase', /[a-z]/.test(val));
        
        // 4. Validar número
        updateRequirement('req-number', /[0-9]/.test(val));
    });

    function updateRequirement(elementId, isValid) {
        const el = document.getElementById(elementId);
        if (isValid) {
            el.classList.remove('invalid');
            el.classList.add('valid');
            // Cambiamos el texto interno para poner el check de éxito
            el.innerHTML = '✓ ' + el.textContent.substring(2);
        } else {
            el.classList.remove('valid');
            el.classList.add('invalid');
            el.innerHTML = '○ ' + el.textContent.substring(2);
        }
    }

    function togglePasswordVisibility(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        
        if (input.type === 'password') {
            input.type = 'text';
            // Inyecta el SVG del ojo con la barra diagonal de tachado (Igual que en tu login)
            icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
        } else {
            input.type = 'password';
            // Restaura el SVG del ojo abierto normal
            icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }
    }
    
    document.getElementById('password').addEventListener('input', e => {
        document.getElementById('password-confirm').value = e.target.value;
    });

</script>
