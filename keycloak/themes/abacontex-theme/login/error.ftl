<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <style>
            /* Resets estrictos para pantalla completa */
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
        </style>
        ¡Ups! Algo salió mal
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
            
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 480px;">
                
                <div style="color: #E06D6D; margin-bottom: 1.5rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>

                <h1 class="login-title" style="margin: 0 0 0.5rem 0; width: 100%; font-size: 3.5rem; line-height: 1.1;">Ha ocurrido un error</h1>
                
                <p style="color: #c2c2c2; text-align: center; font-size: 1.2rem; width: 100%; font-family: 'Outfit', sans-serif; letter-spacing: 0; margin: 10px 0 2rem 0; line-height: 1.4;">
                    ${message.summary}
                </p>

                <div class="form-actions" style="width: 100%; margin-top: 0.5rem;">
                    <a href="${client.baseUrl}" class="btn-login" style="display: flex; align-items: center; justify-content: center; text-decoration: none; width: 100%;">
                        Volver al inicio
                    </a>
                </div>

            </div>

        </div>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            ['kc-header','kc-header-wrapper'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        });
    </script>

    </#if>
</@layout.registrationLayout>