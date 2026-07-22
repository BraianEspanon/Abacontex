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

${kcSanitize(message.summary)?no_esc}

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

        <div
            style="
                width:80px;
                height:80px;
                border-radius:50%;
                background: #5A7956;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:42px;
                color:white;
                margin-bottom:2rem;
            "
        >
            ✓
        </div>

        <h1 class="login-title">

            ${kcSanitize(message.summary)?no_esc}

        </h1>

        <#if message.description??>

            <p
                style="
                    color:#c2c2c2;
                    text-align:center;
                    max-width:420px;
                    margin:1rem 0 2rem;
                    font-size:1.05rem;
                "
            >
                ${kcSanitize(message.description)?no_esc}
            </p>

        </#if>
        
        <div style="width:100%;max-width:360px;display:flex;justify-content:center;">
            <#if pageRedirectUri??>
                <a href="${pageRedirectUri}" class="btn-login" style="display:flex;text-decoration:none;">
                    Volver a la aplicación
                </a>
            <#elseif actionUri??>
                <a href="${actionUri}" class="btn-login" style="display:flex;text-decoration:none;">
                    Continuar
                </a>
            <#elseif client?? && client.baseUrl??>
                <a href="${client.baseUrl}" class="btn-login" style="display:flex;justify-content:center;align-items:center;text-decoration:none;">
                    Volver a la aplicación
                </a>
            <#else>
                <!-- Fallback por si el cliente no tiene una URL base configurada -->
                <p style="color:#c2c2c2; text-align:center;">
                    El proceso ha finalizado. Por favor, cierra esta pestaña y vuelve a la aplicación para iniciar sesión.
                </p>
            </#if>
        </div>
    </div>
</div>

</#if>

</@layout.registrationLayout>