# Gestión de Configuración

## Estrategia de versionado y revisión de código

### Estrategia de versionado

Para la gestión y control de versiones del proyecto se utilizará Git como sistema de control de versiones distribuido, junto con GitHub como plataforma de alojamiento remoto del repositorio.

Esta herramienta permitirá administrar los cambios realizados sobre el código fuente, mantener un historial de modificaciones, facilitar el trabajo colaborativo entre los integrantes del equipo y asegurar la trazabilidad de las distintas versiones del sistema.

### Versionado del software

Para la identificación y control de las distintas versiones del sistema, se utilizará un esquema de versionado basado en Semantic Versioning (SemVer).

Dicho esquema emplea una estructura numérica compuesta por tres componentes:

`MAJOR.MINOR.PATCH`

Donde:

- `MAJOR`: cambios incompatibles o modificaciones significativas
- `MINOR`: incorporación de nuevas funcionalidades
- `PATCH`: corrección de errores o ajustes menores

> Nota: Durante el desarrollo del proyecto se utilizarán versiones preliminares identificadas mediante la numeración `0.x.x`, mientras que la primera versión estable del sistema será identificada como `1.0.0`.

### Criterio de Línea Base

Se establecerá una nueva línea base al finalizar cada incremento funcional del sistema que cumpla con los criterios definidos en la Definition of Done (DoD).

Cada línea base representará una versión estable, integrada y validada del sistema, asociada a un incremento de versión `MINOR` dentro del esquema Semantic Versioning (`MAJOR.MINOR.PATCH`).

---

## Ramas y flujo de trabajo

### Ramas

| Rama | Propósito |
|---|---|
| `main` | Contiene la versión estable y aprobada del sistema |
| `test` | Pruebas funcionales y validaciones QA previas a la liberación a `main` |
| `develop` | Integra funcionalidades y correcciones antes de su validación |
| `feature/*` | Desarrollo de nuevas funcionalidades |
| `fix/*` | Corrección de errores detectados durante el desarrollo |

Las ramas identificadas mediante la notación `feature/*` y `fix/*` representan ramas dinámicas creadas para cada funcionalidad o corrección específica desarrollada durante el proyecto.

Por ejemplo:

- `feature/login`
- `feature/dashboard-admin`
- `fix/error-login`
- `fix/cors-backend`

### Flujo de trabajo

El flujo de trabajo establecido contempla que las nuevas funcionalidades y correcciones sean desarrolladas en ramas independientes (`feature/*` y `fix/*`).

Una vez finalizado su desarrollo, los cambios serán integrados progresivamente en las ramas `develop`, `test` y `main`, siguiendo las distintas etapas de validación técnica, pruebas funcionales y liberación de versiones estables del sistema.

#### Etapas de integración

1. Creación de rama desde `develop`
2. Desarrollo de la funcionalidad o corrección
3. Creación de Pull Request
4. Validación técnica e integración en `develop`
5. Promoción de cambios a `test`
6. Ejecución de pruebas funcionales y QA
7. Integración final en `main`

---

## Integración y revisión de cambios

La integración de cambios entre ramas se realizará mediante Pull Requests en GitHub, evitando modificaciones directas sobre las ramas principales del proyecto.

Cada solicitud de integración deberá ser revisada antes de su aprobación, verificando:

- El correcto funcionamiento de las funcionalidades implementadas
- El cumplimiento de los estándares de codificación definidos por el equipo
- La ausencia de errores críticos o conflictos de integración
- El cumplimiento de la Definition of Done (DoD)
- El cumplimiento de los criterios de aceptación definidos para cada funcionalidad

Las ramas `feature/*` y `fix/*` serán integradas inicialmente en `develop` mediante Pull Requests, donde se realizará una validación técnica inicial del código implementado.

Posteriormente, los cambios serán promovidos a la rama `test`, destinada a la ejecución de pruebas funcionales y actividades de aseguramiento de calidad (QA), con el objetivo de verificar el cumplimiento de los criterios de aceptación definidos para cada funcionalidad.

Finalmente, únicamente las versiones aprobadas y validadas serán incorporadas a la rama `main`, garantizando que esta contenga exclusivamente versiones estables del sistema.

Todo Pull Request deberá contar con al menos una revisión y aprobación antes de ser integrado a las ramas principales del proyecto.

No se permitirán commits directos sobre las ramas `develop`, `test` y `main`, con el objetivo de garantizar la revisión y validación previa de todos los cambios incorporados al sistema.

---

## Convención de commits

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

### Ejemplos

```bash
feat: agregar módulo de autenticación

fix: corregir validación de contraseña

docs: actualizar documentación de API
```

---

## Listado de Ítems de Configuración

| Nombre Ítem | Regla de Nombrado | Ubicación |
|---|---|---|
| User Stories | `US_<<NroUS>>_<<NombreUS>>.pdf` | `/docs/user_stories` |
| Casos de prueba | `CP_<<NroCP>>_US<<NroUS>>_<<NombreCP>>.pdf` | `/docs/casos_de_prueba` |
| Minutas | `Minuta_<<Fecha>>.pdf` | `/docs/minutas` |
| Requerimientos | `REQ_<<NombreREQ>>_<<Version>>.pdf` | `/docs/requerimientos` |
| ADRs | `ADR_<<NroADR>>_<<NombreADR>>.md` | `/docs/adrs` |
| Scripts de Base de Datos | `BD_<<Version>>.sql` | `/database` |
| Planificación | `Planificacion_<<Periodo>>.xlsx` | `/planning` |

### Reglas de Nombrado

| Sigla | Significado |
|---|---|
| `<<NroUS>>` | Número de User Story (`01`, `02`, `03`...) |
| `<<NroCP>>` | Número de Caso de Prueba (`01`, `02`, `03`...) |
| `<<NroADR>>` | Número de ADR (`01`, `02`, `03`...) |
| `<<NombreUS>>` | Nombre descriptivo de la User Story en PascalCase |
| `<<NombreCP>>` | Nombre del caso de prueba en PascalCase |
| `<<NombreREQ>>` | Nombre del requerimiento en PascalCase |
| `<<NombreADR>>` | Nombre del ADR en PascalCase |
| `<<Version>>` | Número de versión (`v1`, `v2`, `v1.1`, etc.) |
| `<<Fecha>>` | Fecha de ocurrencia del evento con formato `dd-mm-aaaa` |
| `<<Periodo>>` | Periodo de vigencia con formato `dd-mm-aaaa_dd-mm-aaaa` |