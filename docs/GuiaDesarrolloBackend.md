# Guía de Desarrollo Backend — Abacontex (versión ampliada)

> Guía práctica para desarrollar nuevas funcionalidades del backend de Abacontex manteniendo las convenciones que actualmente utiliza el proyecto.

## 1. Propósito

Este documento amplía `GuiaDesarrolloBackend.md` con las convenciones consolidadas durante la implementación de Pedidos, Producción y Planificación.

Prioridades:

1. Legibilidad.
2. Separación de responsabilidades.
3. Reglas de negocio explícitas.
4. Mantenibilidad.
5. Consistencia con el código existente.
6. Errores expresivos.

No buscar la solución más corta ni la más sofisticada.

## 2. Stack y arquitectura

El backend utiliza Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Keycloak y Zod.

La arquitectura es un backend monolítico organizado por capas:

```text
Routes
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

Los services nunca acceden directamente a Prisma. Los repositories son la única capa que interactúa con Prisma.

## 3. Estructura de archivos

Los archivos del backend utilizan nombres en minúsculas con kebab-case y sufijo de responsabilidad:

```text
auth.controller.ts
pedido.service.ts
producto.repository.ts
pedido.validator.ts
auth.middleware.ts
```

Los directorios utilizan kebab-case.

Estructura habitual:

```text
config/
controllers/
services/
repositories/
routes/
middlewares/
validators/
integrations/
constants/
types/
utils/
database/
```

Una funcionalidad puede pertenecer al mismo módulo funcional y, aun así, tener archivos propios. Por ejemplo, Planificación pertenece funcionalmente a Producción, pero puede tener:

```text
planificacion.controller.ts
planificacion.service.ts
planificacion.repository.ts
planificacion.routes.ts
planificacion.validator.ts
```

Cuando un mapper pertenece claramente a un subdominio, puede separarse:

```text
dto/
  orden-produccion/
    ord.mapper.ts
```

## 4. Routes

Las routes configuran el pipeline HTTP.

No contienen lógica de negocio, no consultan repositories y no realizan validaciones manuales.

Orden habitual:

```ts
router.post(
  '/',
  authMiddleware,
  requireRole(...),
  validate(schema),
  controller,
);
```

Si un middleware no corresponde, se omite.

Los endpoints REST utilizan sustantivos para recursos y verbos únicamente cuando representan acciones explícitas del dominio.

Ejemplos:

```text
GET   /produccion
GET   /produccion/pedidos-asociables
POST  /produccion/ordenes
PATCH /produccion/ordenes/:id/iniciar
PATCH /produccion/ordenes/:id/finalizar

GET   /produccion/planificacion
POST  /produccion/planificacion
PATCH /produccion/planificacion/:id
```

## 5. Controllers

El controller debe ser delgado.

Responsabilidades:

- recibir `req` y `res`;
- parsear el request con Zod cuando corresponda;
- llamar al service;
- devolver el resultado y status HTTP.

No contiene reglas de negocio.

Patrón:

```ts
export async function actualizarPlanificacionMensual(
  req: Request,
  res: Response,
) {
  const { body, params } = actualizarPlanificacionMensualSchema.parse({
    body: req.body,
    params: req.params,
  });

  const resultado =
    await planificacionService.actualizarPlanificacionMensual(
      req.user!,
      body,
      params,
    );

  res.status(200).json(resultado);
}
```

## 6. Validators y Zod

Zod valida el contrato estructural de entrada:

- tipos;
- strings;
- números;
- formatos;
- obligatoriedad;
- límites;
- emails;
- enums;
- arrays;
- params;
- query;
- body.

No debe validar reglas que dependan del estado de la base de datos.

Ejemplo:

```ts
export const actualizarPlanificacionMensualSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),

  body: z.object({
    unidadesEstimadas: z.coerce.number().int().nonnegative(),
  }),
});
```

Reglas como estas pertenecen al service:

```text
el detalle pertenece a la empresa
el pedido todavía tiene faltantes
la orden está pendiente
el usuario pertenece a una empresa
```

### Contexto temporal de empresas simuladas
Las empresas simuladas pertenecen a un ciclo lectivo acotado (anual). Por ello, los filtros de búsqueda temporales por mes no deben solicitar el año en la query; el año se infiere automáticamente del ciclo lectivo de la empresa o del año actual en curso.

## 7. DTOs y mappers

Los DTOs representan contratos de entrada/salida.

Evitar devolver modelos de Prisma directamente cuando la API necesita otra estructura.

Flujo recomendado:

```text
Prisma model
    ↓
Repository
    ↓
Service
    ↓
Mapper / DTO
    ↓
API response
```

Los mappers adaptan resultados de repositories al formato de la API.

Son especialmente útiles cuando se renombran campos, combinan información o calculan propiedades de presentación.

Los mappers no consultan Prisma ni ejecutan reglas de negocio.

### Identificadores puros
Las respuestas JSON y los DTOs deben devolver los identificadores numéricos puros de la base de datos (`idVenta`, `pedidoId`, `idProducto`, etc.), evitando generar prefijos o identificadores sintéticos (`VEN-0001`, `PED-0001`) para permitir la navegación directa y uniforme desde el frontend.


## 8. Services

El service concentra la lógica de negocio.

Responsabilidades:

- validar reglas de negocio;
- validar pertenencia a empresa;
- validar permisos específicos del dominio;
- coordinar repositories;
- coordinar integraciones;
- decidir operaciones;
- coordinar transacciones;
- preparar datos;
- mapear resultados cuando corresponda.

Los services no importan ni utilizan Prisma.

Cuando varias funciones necesitan la misma validación, extraer una función privada:

```ts
async function obtenerUsuario(user: AuthUser) {
  ...
}
```

Preferir guard clauses:

```ts
if (!usuario.alumno) {
  throw new ConflictError(...);
}

if (!usuario.alumno.empresa) {
  throw new ConflictError(...);
}
```

## 9. Repositories

Los repositories encapsulan Prisma.

Responsabilidades:

- consultar;
- crear;
- actualizar;
- eliminar;
- cargar relaciones;
- traducir errores de Prisma cuando corresponda.

No deben:

- conocer al usuario autenticado;
- validar permisos;
- decidir reglas de negocio;
- decidir transiciones;
- ejecutar casos de uso completos.

Preferir muchos métodos pequeños:

```text
findById()
findByEmpresa()
findByPedidoAndProducto()
findEstadoPendiente()
create()
update()
```

### Reutilización de DTOs en Repositories

Los repositories importan y reutilizan directamente los tipos DTO inferidos por Zod desde los validadores (por ejemplo, `import { ObtenerVentasQueryDTO } from '../validators/venta.validator'`) para tipar parámetros de búsqueda, creación y actualización, manteniendo una única fuente de verdad sin duplicar interfaces locales.

## 10. getDbClient y transacciones

Los repositories utilizan:

```ts
export function getDbClient(tx?: Prisma.TransactionClient) {
  return tx ?? prisma;
}
```

Los métodos que pueden reutilizarse dentro de una transacción aceptan:

```ts
tx?: Prisma.TransactionClient
```

y comienzan con:

```ts
const db = getDbClient(tx);
```

Luego usan `db`, no `prisma` directamente.

Esto permite reutilizar el mismo repository:

```text
Service → Repository → prisma
```

o:

```text
Service
   ↓
transactionRepository.ejecutarTransaccion(...)
   ↓
Repository → tx
```

No es obligatorio agregar `tx` a métodos que nunca participan en transacciones.

## 11. Transaction repository

Las transacciones se centralizan mediante un método propio:

```ts
return transactionRepository.ejecutarTransaccion(async (tx) => {
  ...
});
```

El service conserva dentro del callback las decisiones de negocio:

```ts
return transactionRepository.ejecutarTransaccion(async (tx) => {
  await repository.operacionA(tx);
  await repository.operacionB(tx);

  return resultado;
});
```

La transacción garantiza atomicidad; no debe esconder la lógica de negocio en un repository.

## 12. Cuándo usar transacciones

Usar una transacción cuando varias operaciones deben ser atómicas.

Ejemplo de finalizar una orden:

```text
1. cerrar historial anterior
2. cambiar estado de la orden
3. crear historial nuevo
4. cubrir faltante del pedido
5. comprobar faltantes restantes
6. cambiar estado del pedido si corresponde
```

Si una operación aislada actualiza un único registro y no existe otra modificación que deba ser atómica con ella, no hace falta una transacción.

## 13. Reglas de negocio vs persistencia

El service decide:

```text
¿Puede iniciarse?
¿Puede finalizarse?
¿Existe faltante?
¿Ya existe una orden?
¿Debe cambiar el pedido?
¿Debe incrementarse stock?
```

El repository ejecuta:

```text
buscar
crear
actualizar
eliminar
```

Ejemplo:

```ts
if (orden.estado.nombre !== ESTADOS_PRODUCCION.PENDIENTE) {
  throw new BadRequestError(...);
}

return produccionRepository.iniciarOrdenProduccion(...);
```

El repository no debe decidir si una orden pendiente puede iniciarse.

## 14. Estados y constantes

Los estados reutilizados deben centralizarse.

Ejemplo:

```ts
export const ESTADOS_PRODUCCION = {
  PENDIENTE: 'Pendientes',
  EN_PRODUCCION: 'En Producción',
  FINALIZADA: 'Finalizadas',
} as const;

export type EstadoProduccion =
  (typeof ESTADOS_PRODUCCION)[keyof typeof ESTADOS_PRODUCCION];
```

Para planificación:

```ts
export const ESTADOS_PLANIFICACION = {
  PENDIENTE: 'PENDIENTE',
  CARGADA: 'CARGADA',
} as const;

export type EstadoPlanificacion =
  (typeof ESTADOS_PLANIFICACION)[keyof typeof ESTADOS_PLANIFICACION];
```

No repetir strings de estado por todo el proyecto.

Importante:

```ts
typeof ESTADOS_PLANIFICACION
```

representa el objeto completo.

Para un valor individual utilizar:

```ts
EstadoPlanificacion
```

## 15. Estados calculados

No todo estado mostrado por la interfaz debe persistirse.

Si puede derivarse inequívocamente, puede calcularse en backend.

Ejemplo de planificación:

```text
mes < mes actual  → COMPLETADO
mes = mes actual  → EN_CURSO
mes > mes actual  → SIN_INICIAR
```

En cambio, un estado general que representa información persistente puede almacenarse:

```text
PENDIENTE
CARGADA
```

## 16. Historiales de estados

Cuando una entidad posee historial de estados, cambiar el estado normalmente implica:

```text
1. cerrar historial anterior
2. actualizar estado actual
3. crear historial del nuevo estado
```

Estas operaciones deben estar en una misma transacción cuando la consistencia del historial sea necesaria.

## 17. Concurrencia

Las reglas contra duplicados deben protegerse en dos niveles cuando sea importante:

1. Validación en service para mensajes claros.
2. Restricción de base de datos para concurrencia real.

Ejemplo:

```ts
const ordenExistente =
  await produccionRepository.findByPedidoAndProducto(
    pedido.idPedido,
    data.productoId,
  );

if (ordenExistente) {
  throw new ConflictError(...);
}
```

Además, una restricción `UNIQUE` debe proteger la base frente a dos requests concurrentes.

El repository puede traducir `P2002`:

```ts
catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new ConflictError(...);
  }

  throw error;
}
```

## 18. Errores

Usar las clases centralizadas:

```ts
BadRequestError
ConflictError
ForbiddenError
NotFoundError
```

No utilizar:

```ts
throw new Error(...)
```

No exponer errores internos de Prisma.

Ejemplos:

```text
P2002 → ConflictError
P2025 → NotFoundError
```

Los mensajes deben expresar reglas del dominio:

```text
Ya existe una orden de producción para este producto del pedido.
```

y no:

```text
Unique constraint failed
```

Los `details` deben contener información del dominio, nunca nombres internos de constraints o tablas.

## 19. Autenticación y autorización

Keycloak es el sistema de autenticación y autorización.

El middleware de autenticación valida la identidad y deja disponible el usuario autenticado.

Los services utilizan:

```ts
user.keycloakId
```

para obtener el usuario de la aplicación.

El middleware `requireRole()` valida roles del sistema.

Los services validan permisos específicos del dominio:

```text
es CEO
pertenece a la empresa
empresa activa
curso correcto
puede modificar esta entidad
```

## 20. Seguridad por empresa

Cuando una operación pertenece a una empresa, no confiar únicamente en el ID enviado por el cliente.

Preferir métodos como:

```ts
findByIdAndEmpresa(id, empresaId)
```

El `empresaId` debe provenir del usuario autenticado, no del body del cliente cuando pueda evitarse.

Esto evita acceso entre empresas.

## 21. Recursos relacionados

Al crear un recurso asociado a otra entidad, validar primero las relaciones necesarias.

Ejemplo de orden asociada a pedido:

```text
1. usuario/empresa
2. producto
3. pedido
4. detalle del pedido
5. faltante
6. orden existente
7. cantidad
8. creación
```

El backend debe derivar información confiable en lugar de confiar en datos redundantes enviados por el frontend.

## 22. Flujos entre módulos

Cuando una acción produce efectos en otro módulo, el service debe mostrar explícitamente el flujo.

Ejemplo:

```text
Finalizar orden
      ↓
cubrir faltante
      ↓
¿quedan faltantes?
      ↓
NO
      ↓
Pedido → LISTO_PARA_ENTREGAR
```

Si no existe pedido asociado:

```text
Finalizar orden
      ↓
incrementar stock
```

No esconder el flujo completo dentro de un repository gigante.

## 23. Producción y planificación

Producción y Planificación son partes del mismo módulo funcional, aunque puedan tener archivos separados.

Planificación puede tener:

```text
planificacion.controller.ts
planificacion.service.ts
planificacion.repository.ts
planificacion.routes.ts
planificacion.validator.ts
```

El GET de planificación puede devolver en una única respuesta:

```text
ciclo lectivo
estado
período
resumen anual
detalle mensual
producción real
cumplimiento
estado mensual
```

No crear otro GET únicamente para un modal si la pantalla ya recibió esos datos.

El frontend puede reutilizar el objeto obtenido.

## 24. Métricas

Las métricas de dominio deben calcularse en backend cuando corresponda.

Para planificación:

```text
unidades estimadas
unidades producidas
cumplimiento mensual
cumplimiento anual
estado mensual
```

La producción real se obtiene de órdenes finalizadas.

Si existe historial de estados, la producción debe contabilizarse según el momento en que la orden entró en `FINALIZADA`, no según `createdAt`.

Ejemplo:

```text
Orden creada: agosto
Orden finalizada: septiembre

Producción de septiembre += cantidad
```

El frontend puede realizar cálculos puramente visuales sobre datos ya recibidos, pero el backend es la fuente de verdad de las métricas del dominio.

## 25. PATCH

Cuando se modifica una parte concreta de un recurso, enviar solamente los datos necesarios.

Ejemplo:

```http
PATCH /produccion/planificacion/:id
```

```json
{
  "unidadesEstimadas": 130
}
```

No enviar nuevamente:

```text
empresaId
cicloLectivoId
mes
```

si pueden obtenerse del recurso y del usuario autenticado.

## 26. Prisma y desacoplamiento

El objetivo es que los cambios propios de Prisma afecten principalmente al repository.

El service debe trabajar con datos y conceptos del dominio y coordinar repositories.

No hace falta eliminar absolutamente todos los tipos de Prisma del service si eso agrega abstracción innecesaria, pero Prisma no debe convertirse en la base conceptual de la lógica de negocio.

## 27. Async/await

Preferir:

```ts
const resultado = await repository.metodo();
```

sobre cadenas de `.then()` y `.catch()`.

## 28. Tipado

Mantener TypeScript estricto.

Evitar `any`.

Si un valor es realmente desconocido:

```ts
unknown
```

y validar su tipo.

Convenciones:

```text
variables / parámetros / funciones → camelCase
types / interfaces / clases → PascalCase
constantes → UPPER_SNAKE_CASE
```

No utilizar prefijo `I` para interfaces.

## 29. Comentarios

Los comentarios deben explicar por qué una decisión existe cuando el código no lo deja claro.

Bueno:

```ts
// Si es la primera orden asociada,
// el pedido pasa a En Producción.
```

Evitar comentarios que simplemente repiten el código.

## 30. Legibilidad

Preferir varias líneas claras a una expresión excesivamente compacta.

Extraer funciones cuando una sección tenga una responsabilidad identificable:

```ts
mapearPedidoAsociable()
calcularEstadoMes()
obtenerUsuario()
```

No escribir código excesivamente compacto.

## 31. Testing

El proyecto contempla pruebas unitarias, de integración y pruebas funcionales de endpoints mediante Jest y Supertest.

Las funcionalidades nuevas deberían cubrir especialmente:

- casos exitosos;
- reglas de negocio;
- estados inválidos;
- pertenencia a empresa;
- conflictos;
- validaciones;
- transacciones;
- efectos secundarios entre módulos;
- concurrencia cuando corresponda.

## 32. Checklist antes de implementar

- [ ] Revisar Users, decisiones y documentación funcional.
- [ ] Identificar el recurso y caso de uso.
- [ ] Verificar si ya existe un endpoint equivalente.
- [ ] Definir entrada y salida.
- [ ] Separar validación estructural de reglas de negocio.
- [ ] Identificar entidades afectadas.
- [ ] Determinar si necesita transacción.
- [ ] Evaluar concurrencia.
- [ ] Verificar UNIQUE y FK relevantes.
- [ ] Determinar si necesita mapper.
- [ ] Reutilizar constantes existentes.
- [ ] Verificar pertenencia a empresa.
- [ ] Mantener Prisma dentro de repositories.
- [ ] Mantener reglas de negocio dentro del service.
- [ ] Mantener controllers delgados.
- [ ] Mantener repositories pequeños.

## 33. Filosofía final

Al leer un service debe poder entenderse:

```text
¿Qué quiere hacer el usuario?
¿Qué condiciones deben cumplirse?
¿Qué entidades se modifican?
¿Por qué se modifican?
¿Qué ocurre si algo falla?
```

Al leer un repository debe poder entenderse:

```text
¿Qué datos se consultan o modifican?
¿Cómo se persisten?
```

La consistencia del proyecto tiene prioridad sobre microoptimizaciones o abstracciones innecesarias.

Cuando una implementación nueva se parezca a una funcionalidad existente, replicar primero el patrón existente. Abstraer solamente cuando exista una necesidad real.

## 34. Convenciones concretas de implementación del proyecto

* middleware/ en singular.
* AuthUser desde types/express.
* Imports reales de errors/*.error.
* Convenciones de nombres del dominio en español.
* Patrones exactos de route, controller, service y repository.
* Cuándo utilizar validate() y cuándo no.
* Cómo obtener usuario → alumno → empresa.
* Que empresaId nunca debe confiarse al cliente.
* Que el repository se elige según la entidad consultada/modificada, no necesariamente según el módulo del endpoint.
* Patrón getDbClient(tx).
* Cuándo crear mapper y cuándo no.
* Cuándo usar transacciones.
* Plantillas completas para GET, POST y PATCH.
* Uso de TODO para decisiones pendientes.
* Checklist específico antes de implementar un endpoint.
* Una sección final de “Registro de decisiones de implementación”, que funcione justamente como constancia de los acuerdos que vamos consolidando.

