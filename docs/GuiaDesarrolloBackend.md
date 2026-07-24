# Guía de Desarrollo Backend (Abacontex)

Este documento define las convenciones arquitectónicas del backend de Abacontex.

El objetivo es que cualquier desarrollador (humano o IA) implemente nuevas funcionalidades siguiendo exactamente el mismo estilo del proyecto.

---

# Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Keycloak
- Zod v4
- Nodemailer

Arquitectura en capas.

Nunca acceder a Prisma directamente desde los services.

---

# Arquitectura

Siempre respetar la siguiente separación de responsabilidades.

```
Routes
↓
Controller
↓
Service
↓
Repository
↓
Prisma
```

Cada capa tiene una única responsabilidad.

---

# Routes

Las rutas únicamente configuran el pipeline de ejecución.

No contienen lógica de negocio.

No realizan validaciones manuales.

No acceden a repositories ni services.

Siempre siguen el siguiente orden:

```ts
router.post(
  "/",
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(schema),
  controller,
);
```

Orden de los middlewares:

1. authenticate
2. requireRole
3. validate (si corresponde)
4. controller

Las rutas deben agruparse por recurso.

Ejemplo:

```text
Empresa

GET    /empresas/me
PATCH  /empresas/me

Invitaciones

POST   /empresas/me/invitaciones
GET    /empresas/me/invitaciones
POST   /empresas/me/invitaciones/:id/aceptar
POST   /empresas/me/invitaciones/:id/rechazar
GET    /empresas/me/invitaciones/enviadas
```

---

# Controller

Los controllers únicamente deben:

- recibir `req` y `res`
- invocar al service
- devolver la respuesta

Nunca deben contener lógica de negocio.

Ejemplo:

```ts
export async function getEmpresaActual(req: Request, res: Response) {
  const empresa = await empresaService.getEmpresaActual(req.user!);

  res.json(empresa);
}
```

---

# Service

Toda la lógica de negocio vive en los services.

Los services son responsables de:

- validar reglas de negocio
- verificar permisos
- combinar múltiples repositories
- llamar integraciones externas
- construir DTOs cuando corresponda
- coordinar transacciones

Los services **NO** acceden a Prisma.

Los services solamente utilizan repositories e integraciones.

---

# Repository

Los repositories son la única capa autorizada a acceder a Prisma.

Un repository:

- consulta datos
- inserta datos
- actualiza datos
- elimina datos

No contiene reglas de negocio.

No valida permisos.

No conoce al usuario autenticado.

---

# Validaciones

Las validaciones se dividen en cuatro niveles.

## 1. Zod

Se utiliza exclusivamente para validar:

- tipos
- formato
- longitud
- obligatoriedad
- emails
- enums
- números

Nunca reglas de negocio.

Ejemplos:

- email válido
- máximo 10 elementos
- array sin correos duplicados

---

## 2. Service

Toda regla de negocio pertenece al service.

Ejemplos:

- empresa activa
- usuario CEO
- invitación vigente
- usuario no registrado
- curso correcto
- usuario sin empresa
- usuario autenticado

---

## 3. Base de datos

La base de datos garantiza únicamente integridad.

Ejemplos:

- UNIQUE
- FOREIGN KEY
- índices
- restricciones

---

## 4. Repository

Los repositories solamente traducen errores de Prisma cuando sea necesario.

Nunca contienen lógica de negocio.

---

# Manejo de errores

Todo error de negocio debe lanzar una subclase de `AppError`.

Nunca lanzar `Error`.

Ejemplos:

```ts
throw new ConflictError(...)
throw new ForbiddenError(...)
throw new NotFoundError(...)
throw new BadRequestError(...)
```

---

# Prisma

Nunca exponer errores internos de Prisma al frontend.

Cuando sea necesario traducirlos:

```
P2002 → ConflictError
P2025 → NotFoundError
```

Los mensajes deben representar reglas de negocio, nunca detalles técnicos.

Incorrecto:

```
Unique constraint failed
```

Correcto:

```
Ya existe una invitación pendiente para ese correo.
```

---

# details

El campo `details` debe contener información del dominio.

Nunca información interna de Prisma.

Incorrecto:

```json
{
  "constraint": "empresa_email_key"
}
```

Correcto:

```json
{
  "email": "juan@test.com"
}
```

o

```json
{
  "cursoAlumno": 4,
  "cursoEmpresa": 5
}
```

---

# Transacciones

Las transacciones solamente se utilizan cuando varias operaciones deben ejecutarse de manera atómica.

Toda la lógica sigue estando en el service.

El repository únicamente ejecuta la transacción.

---

# Repositories

Los repositories deben ser pequeños.

Es preferible tener muchos métodos simples que pocos métodos enormes.

Ejemplos:

```text
findById()

findByEmail()

findByEmpresa()

findPendienteByEmail()

create()

update()

aceptar()

rechazar()
```

---

# Services privados

Cuando un service comienza a crecer, extraer funciones privadas.

Ejemplos:

```ts
validarInvitacionPendienteDelUsuario();

validarCorreosInvitacion();

obtenerAlumnoActual();
```

Esto mejora la legibilidad.

---

# Integraciones

Las integraciones externas viven en:

```
integrations/
```

Ejemplos:

```
email/

keycloak/

storage/
```

Los services consumen integraciones.

Nunca al revés.

---

# Emails

Los templates HTML viven separados.

Ejemplo:

```
email/

    email.client.ts

    email.service.ts

    templates/

        welcome-email.template.ts

        invitation-email.template.ts
```

El service únicamente envía el correo.

Toda la vista pertenece al template.

---

# DTOs

Los DTOs representan el contrato de la API.

Nunca devolver directamente modelos de Prisma cuando no sea necesario.

Preferir DTOs explícitos.

---

# Endpoints

Los endpoints REST deben utilizar nombres consistentes.

Ejemplos:

```
GET    /empresas/me
PATCH  /empresas/me

POST   /empresas/me/invitaciones
GET    /empresas/me/invitaciones
GET    /empresas/me/invitaciones/enviadas
POST   /empresas/me/invitaciones/:id/aceptar
POST   /empresas/me/invitaciones/:id/rechazar
```

Utilizar:

- sustantivos para recursos
- verbos únicamente cuando representan acciones del dominio (`aceptar`, `rechazar`)

---

# Permisos

Las validaciones de permisos pertenecen al service.

Ejemplos:

- es CEO
- empresa activa
- pertenece a la empresa
- curso correcto

El middleware `requireRole()` solamente valida el rol del sistema.

---

# Convenciones

Preferir guard clauses antes que `if` anidados.

Ejemplo:

```ts
if (!empresa) {
  throw ...
}

if (!usuario) {
  throw ...
}

if (!empresa.activa) {
  throw ...
}
```

---

# Código

Priorizar siempre:

- legibilidad
- nombres descriptivos
- funciones pequeñas
- responsabilidades claras

No escribir código excesivamente compacto.

Es preferible escribir algunas líneas más si eso mejora la lectura.

---

# Filosofía del proyecto

Cuando exista más de una solución técnicamente correcta, se priorizará aquella que:

- sea más fácil de leer dentro de seis meses;
- mantenga una separación clara entre capas;
- evite duplicar lógica;
- exprese las reglas de negocio de forma explícita;
- sea consistente con el resto del proyecto.

No se busca escribir el código más corto ni el más "ingenioso", sino el más mantenible.

La consistencia del proyecto tiene prioridad sobre preferencias personales o microoptimizaciones.

---

# Objetivo general

Este proyecto prioriza, en este orden:

1. Legibilidad.
2. Separación de responsabilidades.
3. Reglas de negocio claras.
4. Mantenibilidad.
5. Consistencia arquitectónica.
6. Errores expresivos.

Antes de escribir código nuevo, verificar siempre que respete estos principios.
