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

        <!-- Círculo decorativo con SVG en línea -->
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
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
        </div>

        <h1 class="login-title">
            Verifica tu correo
        </h1>

        <p
            style="
                color:#c2c2c2;
                text-align:center;
                max-width:420px;
                margin:1rem 0 1rem;
                font-size:1.05rem;
            "
        >
            Te hemos enviado un correo con instrucciones a <br>
            <strong style="color:white;">${(user.email)!''}</strong>. <br><br>
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </p>

        <div style="width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center;margin-top:1.5rem;">
            
            <p style="color:#c2c2c2; font-size: 0.95rem; margin-bottom: 0.8rem;">
                ¿No recibiste el correo?
            </p>
            
            <a
                href="${url.loginAction}"
                class="btn-login"
                style="
                    width:100%;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    text-decoration:none;
                "
            >
                Reenviar correo
            </a>

            <!-- Botón secundario: Volver al inicio -->
            <#if client?? && client.baseUrl?has_content>
                <a 
                    href="${client.baseUrl}" 
                    style="
                        color: #c2c2c2;
                        text-decoration: none;
                        font-size: 0.95rem;
                        margin-top: 1.5rem;
                    "
                    onmouseover="this.style.color='white'"
                    onmouseout="this.style.color='#c2c2c2'"
                >
                    Volver al inicio
                </a>
            </#if>

        </div>

    </div>

</div>

</#if>

</@layout.registrationLayout>