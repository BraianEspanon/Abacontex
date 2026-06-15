<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "header">
        <!-- Título que aparecerá arriba -->
        Vincular con Google
    <#elseif section = "form">
        <div class="login-page-wrapper">
            
            <!-- Panel izquierdo: Tu ilustración y mascota -->
            <div class="left-panel">
                <div class="blob-wrapper">
                    <img src="${url.resourcesPath}/img/formas.svg" alt="Fondo" class="blob-img" onerror="this.style.display='none'" />
                    <img src="${url.resourcesPath}/img/mascota.png" alt="Mascota" class="mascota-img" />
                </div>
            </div>

            <!-- Panel derecho: El botón de confirmación -->
            <div class="right-panel">
                <h1 class="login-title" style="max-width: 600px;">Cuenta existente</h1>
                <p style="color: #c2c2c2; text-align: center; margin-bottom: 2rem; font-size: 1.1rem;">
                    Hemos detectado que ya tienes una cuenta registrada con este correo. Haz clic abajo para asociarla directamente con tu perfil de Google.
                </p>

                <form id="kc-idp-link-confirm-form" action="${url.loginAction}" method="post">
                    <div class="form-actions">
                        <button type="submit" class="btn-login" name="submitAction" id="linkAccount" value="linkAccount" style="width: 350px;">
                            Confirmar y Vincular Cuenta
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </#if>
</@layout.registrationLayout>