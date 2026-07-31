# Flujo de registro con y sin invitación

## Objetivo

El sistema tiene un único camino para completar el registro del alumno.

La diferencia entre un registro normal y uno proveniente de una invitación la determina el backend.

El frontend nunca debe intentar deducir el flujo por sí solo; debe consultar al backend y actuar según la respuesta.

---

# Flujo general

```text
GET /alumnos/me
      │
      ▼
registroCompleto?
      │
      ├── Sí ─────────────► Aplicación
      │
      └── No
            │
            ▼
GET /alumnos/me/invitacion
            │
  ┌─────────┴──────────────┐
  │                        │
 404                      200
  │                        │
  │                        ▼
  │                  Pantalla de
  │                   invitación
  │                       │
  │             ┌─────────┴──────┐
  │             │                │
  │             ▼                ▼
  │         Rechazar          Aceptar
  │     (POST rechazar)   (POST aceptar)
  │             │                │
  │             ▼                ▼
  └────►Registro normal   Registro por invitación
                │             │
                │             │
                ▼             ▼
            GET /alumnos/me/registro
           El backend determina el flujo
          y devuelve los datos necesarios
            (tipo = NORMAL | INVITACION)
                      │
                      ▼
          PATCH /alumnos/me/registro
                      │
                      ▼
              GET /alumnos/me
          (registroCompleto = true)
                      │
                      ▼
                Aplicación
```

---

# 1. Registro en Keycloak

El usuario crea su cuenta normalmente.

No existe diferencia entre un usuario invitado y uno no invitado durante este paso. La única diferencia visible es que, cuando el registro proviene de una invitación, el correo electrónico ya aparece completo y no puede modificarse por experiencia de usuario.

Keycloak solo se encarga de:

- crear la cuenta
- verificar el correo electrónico
- permitir el inicio de sesión

Keycloak no conoce los conceptos de Empresa, Alumno ni Invitación.

Toda la lógica relacionada con invitaciones es responsabilidad exclusiva del backend de Abacontex.

---

# 2. Primer login

Luego del login, el frontend ejecuta:

```http
GET /alumnos/me
```

Respuesta esperada:

```json
{
  "registroCompleto": false,
  "id": "...",
  "nombre": "...",
  "apellido": "...",
  "email": "..."
}
```

o

```json
{
  "registroCompleto": true,
  "id": "...",
  "nombre": "...",
  "apellido": "...",
  "email": "..."
}
```

Si `registroCompleto` es `true`, el flujo termina y el usuario entra a la aplicación.

---

# 3. Buscar invitación

Si `registroCompleto` es `false`, el frontend consulta:

```http
GET /alumnos/me/invitacion
```

Este endpoint busca una invitación asociada al usuario que aún esté dentro del proceso de registro.

Se consideran válidas las invitaciones en estado:

- `PENDIENTE`
- `ACEPTADA`

Si no existe ninguna invitación válida, responde:

```http
404 Not Found
```

En ese caso, el frontend continúa con el registro normal.

Si existe una invitación, responde con un objeto como este:

```json
{
  "id": 15,
  "estado": "PENDIENTE",
  "empresa": {
    "id": 3,
    "nombre": "EcoHarmony",
    "actividad": "Tecnología",
    "logoUrl": null,
    "idCurso": 2,
    "activo": true
  },
  "createdBy": {
    "nombre": "Juan",
    "apellido": "Pérez"
  },
  "fechaExpiracion": "2026-08-01T12:00:00.000Z"
}
```

El frontend continúa con el flujo de invitación.

---

# Pantalla de invitación

El alumno visualiza:

- empresa
- información del invitador
- fecha de expiración

Tiene dos opciones.

## Rechazar

```http
POST /alumnos/me/invitacion/:id/rechazar
```

El backend:

- valida que la invitación pertenezca al usuario autenticado
- valida que esté en estado `PENDIENTE`
- cambia el estado a `CANCELADA`

Luego el frontend continúa automáticamente al registro normal.

## Aceptar

```http
POST /alumnos/me/invitacion/:id/aceptar
```

Este endpoint no incorpora todavía al alumno a la empresa ni le asigna rol empresarial.

Solo cambia el estado de la invitación:

```text
PENDIENTE
   │
   ▼
ACEPTADA
```

En este punto:

- `Alumno.idEmpresa = null`
- `Alumno.idRolEmpresa = null`

---

## Importante

Si el usuario ya aceptó previamente la invitación y vuelve a iniciar sesión sin haber completado el registro, el backend devolverá nuevamente la invitación en estado `ACEPTADA`.

En ese caso el frontend no debe volver a mostrar la pantalla de aceptar/rechazar, sino que debe continuar directamente al paso de completar el registro por invitación.

---

# Pantalla de completar registro

Una vez aceptada la invitación, o cuando el usuario no tiene una invitación activa, el frontend consulta:

```http
GET /alumnos/me/registro
```

Este endpoint devuelve la información necesaria para construir la pantalla según el flujo correspondiente.

## Registro normal

Respuesta:

```json
{
  "tipo": "NORMAL",
  "cursos": [
    {
      "idCurso": 1,
      "nombreCurso": "6° A"
    }
  ],
  "rolesEmpresa": [
    {
      "idRol": 1,
      "nombreRol": "COO",
      "descripcion": null
    }
  ]
}
```

## Registro por invitación

Respuesta:

```json
{
  "tipo": "INVITACION",
  "empresa": {
    "id": 3,
    "nombre": "EcoHarmony"
  },
  "curso": {
    "idCurso": 2,
    "nombreCurso": "6° A"
  },
  "rolesEmpresa": [
    {
      "idRol": 2,
      "nombreRol": "CTO",
      "descripcion": null
    }
  ]
}
```

En el flujo por invitación:

- la empresa viene del backend
- el curso viene del backend
- los roles disponibles excluyen a `CEO`

---

# Confirmación final

El usuario confirma el registro mediante:

```http
PATCH /alumnos/me/registro
```

## Body para registro normal

```json
{
  "idCurso": 3,
  "idRolEmpresa": 5
}
```

## Body para registro por invitación

```json
{
  "idRolEmpresa": 5
}
```

El backend:

- valida si existe una invitación aceptada para el usuario
- valida que la empresa siga activa
- crea el registro del alumno
- asigna el curso y/o la empresa según el flujo
- asigna el rol empresarial seleccionado
- marca el registro como completo
- finaliza la invitación cuando corresponde

---

# Estados posibles de una invitación

## PENDIENTE

El usuario todavía no respondió.

Puede:

- aceptar
- rechazar

## ACEPTADA

El usuario aceptó la invitación.

Todavía:

- no pertenece a la empresa
- no tiene rol empresarial
- no terminó su registro

Cada vez que vuelva a iniciar sesión, el backend debe seguir el flujo de registro por invitación.

## CANCELADA

El usuario rechazó la invitación.

No vuelve a mostrarse.

El usuario continúa con el flujo de registro normal.

## EXPIRADA

La invitación venció.

No puede utilizarse nuevamente.

El usuario continúa con el flujo de registro normal.

## FINALIZADA

Estado interno utilizado cuando el usuario completó el registro a partir de una invitación.

No debe exponerse como una invitación activa para el frontend.

---

# Responsabilidades del backend

## GET /alumnos/me

Responsabilidad:

- devolver el estado del usuario (`registroCompleto` y el perfil básico).

Nunca debe:

- buscar invitaciones
- decidir el siguiente paso del flujo

## GET /alumnos/me/invitacion

Responsabilidad:

- buscar una invitación asociada al usuario en estado `PENDIENTE` o `ACEPTADA`
- si la invitación está pendiente y vencida, marcarla automáticamente como `EXPIRADA`
- validar que la empresa siga activa
- devolver la información necesaria para continuar el flujo

## POST /alumnos/me/invitacion/:id/aceptar

Valida:

- que la invitación pertenezca al usuario autenticado
- que la invitación esté en estado `PENDIENTE`
- que no haya expirado
- que la empresa siga activa

Acción:

- cambiar el estado de la invitación a `ACEPTADA`

## POST /alumnos/me/invitacion/:id/rechazar

Valida:

- que la invitación pertenezca al usuario autenticado
- que la invitación esté en estado `PENDIENTE`
- que no haya expirado
- que la empresa siga activa

Acción:

- cambiar el estado de la invitación a `CANCELADA`

## GET /alumnos/me/registro

Responsabilidad:

- devolver los datos necesarios para la pantalla de completar registro
- distinguir entre flujo normal e invitación

## PATCH /alumnos/me/registro

Responsabilidad:

- completar el registro del alumno
- crear el alumno con el curso/empresa/rol correspondientes
- finalizar la invitación si el flujo provino de una invitación

---

# Principios de diseño

- Keycloak permanece completamente desacoplado del dominio de negocio.
- El frontend nunca decide el flujo de registro; siempre consulta al backend.
- Existe un único punto de finalización del registro: `PATCH /alumnos/me/registro`.
- Las invitaciones son responsabilidad exclusiva del backend.
- Cuando existe una invitación aceptada, la empresa y el curso nunca provienen del frontend.
- Toda la lógica de negocio permanece centralizada en el backend.
- El diseño permite extender el flujo de registro sin modificar Keycloak.

---

# Regla de expiración de invitaciones

La fecha de expiración solo aplica mientras la invitación está en estado `PENDIENTE`.

Una vez que el alumno acepta la invitación, esta deja de estar sujeta a la expiración y podrá completar su registro en cualquier momento, siempre que la empresa siga activa.
