<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=true; section>

<#if section = "header">

<style>
    /* Oculta completamente el layout nativo */
    #kc-header,
    #kc-header-wrapper,
    .login-pf-header,
    header,
    nav,
    .navbar,
    .navbar-pf,
    [class*="navbar"],
    .pf-c-page__header,
    .pf-v5-c-page__header {
        display: none !important;
        height: 0 !important;
    }

    body,
    body.login-pf {
        margin: 0 !important;
        padding: 0 !important;
    }

    #kc-container,
    #kc-container-wrapper,
    .container-fluid,
    .row,
    .card-pf,
    .login-pf-page .card-pf {
        all: unset !important;
        display: contents !important;
    }
</style>

<#elseif section = "form">

<div class="login-page-wrapper">

    <!-- Panel izquierdo -->
    <div class="left-panel">
        <div class="blob-wrapper">
            <img
                src="${url.resourcesPath}/img/formas.svg"
                class="blob-img"
                onerror="this.style.display='none'"
            />
            <img
                src="${url.resourcesPath}/img/mascota.png"
                class="mascota-img"
            />
        </div>
    </div>

    <!-- Panel derecho -->
    <div class="right-panel">

        <!-- Círculo decorativo con SVG de Reloj -->
        <div
            style="
                width:80px;
                height:80px;
                border-radius:50%;
                background: #5A7956;
                display:flex;
                align-items:center;
                justify-content:center;
                margin-bottom:2rem;
            "
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ffffff" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        </div>

        <h1 class="login-title">
            La sesión ha expirado
        </h1>

        <p
            style="
                color:#c2c2c2;
                text-align:center;
                max-width:420px;
                margin:1rem 0 2rem;
                font-size:1.05rem;
            "
        >
            El proceso de inicio de sesión ha tardado demasiado o el enlace ya no es válido.
        </p>

        <div style="width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center;gap:1rem;">
            
            <!-- Botón principal: Reinicia el flujo -->
            <a
                href="${url.loginRestartFlowUrl}"
                class="btn-login"
                style="
                    width:100%;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    text-decoration:none;
                "
            >
                Reiniciar proceso
            </a>

            <!-- Botón secundario: Intenta continuar si es posible -->
            <a 
                href="${url.loginAction}" 
                style="
                    color: #c2c2c2;
                    text-decoration: none;
                    font-size: 0.95rem;
                    margin-top: 0.5rem;
                "
                onmouseover="this.style.color='white'"
                onmouseout="this.style.color='#c2c2c2'"
            >
                Intentar continuar
            </a>

        </div>

    </div>

</div>

</#if>

</@layout.registrationLayout>