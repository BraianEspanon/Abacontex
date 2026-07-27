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

    /* Ajustes extra por si el botón type="submit" no hereda los mismos estilos que la etiqueta <a> */
    button.btn-login {
        font-family: inherit;
        border: none;
        cursor: pointer;
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

        <h1 class="login-title">
            ¿Quiere cerrar sesión?
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
            Estás a punto de cerrar tu sesión actual. Haz clic en el botón de abajo para confirmar.
        </p>

        <div style="width:100%;max-width:360px;display:flex;flex-direction:column;align-items:center;gap:1rem;">
            
            <!-- El formulario vital para Keycloak -->
            <form action="${url.logoutConfirmAction}" method="POST" style="width: 100%;">
                
                <!-- Token oculto de seguridad requerido por Keycloak -->
                <input type="hidden" name="session_code" value="${logoutConfirm.code}">
                
                <button 
                    type="submit" 
                    name="confirmLogout" 
                    class="btn-login" 
                    style="
                        width:100%;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        text-decoration:none;
                    "
                >
                    Cerrar sesión
                </button>
            </form>

            <!-- Botón secundario para cancelar o volver -->
            <#if !logoutConfirm.skipLink??>
                <#if (client.baseUrl)?has_content>
                    <a 
                        href="${client.baseUrl}" 
                        style="
                            color: #c2c2c2;
                            text-decoration: none;
                            font-size: 0.95rem;
                            margin-top: 1rem;
                        "
                        onmouseover="this.style.color='white'"
                        onmouseout="this.style.color='#c2c2c2'"
                    >
                        Volver a la aplicación
                    </a>
                </#if>
            </#if>

        </div>

    </div>

</div>

</#if>

</@layout.registrationLayout>