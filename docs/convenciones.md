# Convención de commits

Con el objetivo de mantener un historial de cambios claro, organizado y fácilmente trazable, el equipo utilizará una convención estandarizada para la generación de commits dentro del repositorio.

Cada mensaje de commit incluirá un prefijo que permitirá identificar el tipo de modificación realizada sobre el proyecto.

| Prefijo | Descripción |
|---|---|
| `feat:` | Incorporación de nuevas funcionalidades |
| `fix:` | Corrección de errores |
| `docs:` | Modificaciones en documentación |
| `refactor:` | Reestructuración interna del código sin alterar funcionalidades |
| `style:` | Cambios de formato o estilos visuales |
| `test:` | Incorporación o modificación de pruebas |
| `chore:` | Tareas de mantenimiento y configuración |

## Ejemplos

```bash
feat: agregar módulo de autenticación

fix: corregir validación de contraseña

docs: actualizar documentación de API
```

# Convención de ramas

| Rama | Propósito |
|---|---|
| `main` | Contiene la versión estable y aprobada del sistema |
| `test` | Pruebas funcionales y validaciones QA previas a la liberación a `main` |
| `develop` | Integra funcionalidades y correcciones antes de su validación |
| `feature/*` | Desarrollo de nuevas funcionalidades |
| `fix/*` | Corrección de errores detectados durante el desarrollo |

Las ramas identificadas mediante la notación `feature/*` y `fix/*` representan ramas dinámicas creadas para cada funcionalidad o corrección específica desarrollada durante el proyecto.

## Ejemplos

```bash
feature/login

feature/dashboard-admin

fix/error-login

fix/cors-backend
```
