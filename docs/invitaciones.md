# Flujo de registro con y sin invitación

## Objetivo

El sistema tendrá un único punto de entrada para completar el registro del alumno.

La diferencia entre un registro normal y uno proveniente de una invitación será determinada completamente por el backend.

El frontend nunca deberá intentar deducir el flujo por sí solo.

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

No existe ninguna diferencia entre un usuario invitado y uno no invitado durante este paso. La única diferencia visible es que, cuando el registro proviene de una invitación, el correo electrónico ya aparece completo y no puede modificarse por cuestiones de experiencia de usuario.

Keycloak únicamente se encarga de:

- crear la cuenta
- verificar el correo electrónico
- permitir el inicio de sesión

Keycloak no conoce el concepto de Empresa, Alumno ni Invitación.

Toda la lógica relacionada con invitaciones es responsabilidad exclusiva del backend de Abacontex.

---

# 2. Primer login

Luego del login el frontend ejecuta:

```
GET /alumnos/me
```

Respuesta:

```json
{
  "registroCompleto": false
}
```

o

```json
{
  "registroCompleto": true,
  ...
}
```

Si `registroCompleto` es `true`, el flujo termina y el usuario ingresa normalmente a la aplicación.

---

# 3. Buscar invitación

Si `registroCompleto` es `false`, el frontend consulta:

```
GET /alumnos/me/invitacion
```

Este endpoint busca una invitación asociada al usuario que todavía forme parte del proceso de registro.

Es decir:

- PENDIENTE
- ACEPTADA

Si no existe ninguna, responde:

```http
404 Not Found
```

El frontend continúa con el registro normal.

---

Si existe una invitación, responde:

```json
{
  "id": 15,
  "estado": "PENDIENTE",
  "empresa": {
    "id": 3,
    "nombre": "EcoHarmony"
  },
  "curso": {
    "id": 2,
    "nombre": "6° A"
  },
  "invitadoPor": {
    "nombre": "Juan",
    "apellido": "Pérez"
  },
  "fechaExpiracion": "..."
}
```

El frontend continúa con el flujo de invitación.

---

# Pantalla de invitación

El alumno visualiza:

- empresa
- curso
- quién realizó la invitación
- fecha de expiración

Tiene dos opciones.

## Rechazar

```
POST /empresas/me/invitaciones/:id/rechazar
```

El backend:

- valida la invitación
- cambia su estado a CANCELADA

Luego el frontend continúa automáticamente al registro normal.

---

## Aceptar

```
POST /empresas/me/invitaciones/:id/aceptar
```

Este endpoint **no incorpora todavía al alumno**.

Únicamente cambia el estado de la invitación:

```
PENDIENTE
        │
        ▼
ACEPTADA
```

Todavía:

```
Alumno.idEmpresa = null
Alumno.idRolEmpresa = null
```

---

## Importante

Si el usuario ya aceptó previamente la invitación y vuelve a iniciar sesión sin haber completado el registro, el backend devolverá nuevamente dicha invitación (estado `ACEPTADA`).

En ese caso el frontend **no vuelve a mostrar la pantalla de aceptar/rechazar**, sino que continúa directamente al paso **Completar registro por invitación**.

---

# Pantalla "Completar registro por invitación"

Una vez aceptada la invitación, el frontend obtiene la información necesaria (o reutiliza la recibida anteriormente).

La pantalla muestra:

- Empresa (bloqueada)
- Curso (bloqueado)
- Rol empresarial (seleccionable)

Roles disponibles:

- COO
- CFO
- CTO
- CIO
- CCO
- CMO
- etc.

Nunca:

- CEO

---

# Confirmación final

El usuario confirma el registro.

```
POST /alumnos/completar-registro
```

Body:

```json
{
  "rolEmpresaId": 5
}
```

El backend:

- busca la invitación ACEPTADA
- valida que la empresa continúe activa
- asigna la empresa
- asigna automáticamente el curso de dicha empresa
- asigna el rol seleccionado
- marca el registro como completo
- finaliza definitivamente la invitación

Todo ocurre dentro de una única transacción.

---

# Registro normal

Si el usuario no posee ninguna invitación activa:

```
POST /alumnos/completar-registro
```

Body:

```json
{
  "cursoId": 3,
  "rolEmpresaId": 5
}
```

Al finalizar:

- se crea el registro de Alumno
- se asigna el curso seleccionado
- se asigna el rol empresarial seleccionado
- el alumno queda sin empresa (`idEmpresa = null`)

Posteriormente podrá ser incorporado a una empresa según las reglas del sistema.

---

# Estados posibles de una invitación

## PENDIENTE

El usuario todavía no respondió.

Puede:

- aceptar
- rechazar

---

## ACEPTADA

El usuario aceptó la invitación.

Todavía:

- no pertenece a la empresa
- no tiene rol empresarial
- no terminó su registro

Cada vez que vuelva a iniciar sesión, el backend deberá continuar automáticamente el flujo de registro por invitación.

---

## CANCELADA

El usuario rechazó la invitación.

No vuelve a mostrarse.

El usuario continúa el flujo de registro normal.

---

## EXPIRADA

La invitación venció.

No puede utilizarse nuevamente.

El usuario continúa el flujo de registro normal.

---

# Responsabilidades del backend

## `GET /alumnos/me`

**Responsabilidad**

- devolver el estado del usuario (`registroCompleto` y demás información del perfil).

**Nunca**

- buscar invitaciones.
- decidir el siguiente paso del flujo de registro.

---

## `GET /alumnos/me/invitacion`

**Responsabilidad**

- buscar una invitación asociada al usuario en estado **PENDIENTE** o **ACEPTADA**.
- si la invitación está pendiente y vencida, marcarla automáticamente como **EXPIRADA**.
- validar que la empresa continúe activa.
- devolver la información necesaria para continuar el flujo de registro.

---

## `POST /empresas/me/invitaciones/:id/aceptar`

**Valida**

- la invitación pertenece al usuario autenticado.
- la invitación se encuentra en estado **PENDIENTE**.
- la invitación no ha vencido.
- la empresa continúa activa.

**Acción**

- cambiar el estado de la invitación a **ACEPTADA**.

Este endpoint **no asigna todavía empresa ni rol empresarial**.

---

## `POST /empresas/me/invitaciones/:id/rechazar`

**Valida**

- la invitación pertenece al usuario autenticado.
- la invitación se encuentra en estado **PENDIENTE**.
- la invitación no ha vencido.
- la empresa continúa activa.

**Acción**

- cambiar el estado de la invitación a **CANCELADA**.

---

## `POST /alumnos/completar-registro`

Este endpoint soporta dos flujos distintos.

### Registro normal

**Valida**

- curso seleccionado.
- rol empresarial seleccionado.

**Acciones**

- crear el registro de Alumno.
- asignar el curso.
- asignar el rol empresarial.
- marcar el registro como completo.

---

### Registro por invitación

**Valida**

- existencia de una invitación en estado **ACEPTADA**.
- que la empresa continúe activa.

**Acciones**

- asignar la empresa.
- asignar automáticamente el curso de la empresa.
- asignar el rol empresarial seleccionado.
- marcar el registro como completo.
- cerrar definitivamente la invitación.

Todas estas operaciones deben ejecutarse dentro de una única transacción.

---

# Principios de diseño

- Keycloak permanece completamente desacoplado del dominio de negocio.
- El frontend nunca decide el flujo de registro; siempre consulta al backend.
- Existe un único endpoint para completar el registro (`POST /alumnos/completar-registro`).
- Las invitaciones son responsabilidad exclusiva del backend.
- Cuando existe una invitación aceptada, la empresa y el curso nunca provienen del frontend.
- Toda la lógica de negocio permanece centralizada en el backend.
- El diseño permite extender el flujo de registro sin modificar Keycloak.

---

# Regla de expiración de invitaciones

La fecha de expiración únicamente aplica mientras la invitación se encuentra en estado **PENDIENTE**.

Una vez que el alumno acepta la invitación, esta deja de estar sujeta a la fecha de expiración y podrá completar su registro en cualquier momento.

El único requisito para finalizar el registro será que la empresa continúe activa.

# Obtener datos para completar el registro

Antes de mostrar la pantalla "Completar registro", el frontend consulta:

GET /alumnos/me/registro

Este endpoint devuelve toda la información necesaria para construir la pantalla según el flujo correspondiente.

## Registro normal

Respuesta:

{
"tipo": "NORMAL",
"roles": [...],
"cursos": [...]
}

## Registro por invitación

Respuesta:

{
"tipo": "INVITACION",
"empresa": {...},
"curso": {...},
"roles": [...]
}
