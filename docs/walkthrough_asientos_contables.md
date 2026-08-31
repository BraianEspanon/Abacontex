# 📚 Walkthrough & Roadmap: Módulo de Asientos Contables (Abacontex ERP)

> **Estado del Proyecto:** `npm run check` pasando con **0 errores** (ESLint, Jest, Prettier y TypeScript build completados exitosamente).

---

## 🗺️ Mapa Completo del Módulo por Fases

### 🚀 Fase 1: Catálogos y Carga de Asientos Contables (Core)

_Es el bloque principal necesario para que los alumnos puedan cargar y validar asientos en la plataforma._

- [x] **`GET /contabilidad/asientos/tipos-movimiento`**: Catálogo de variaciones patrimoniales ($A+$, $A-$, $P+$, etc.) para los desplegables del frontend.
- [x] **`GET /contabilidad/asientos/pendientes`**: Consulta de operaciones comerciales (ventas, movimientos financieros, conciliaciones) pendientes de registrar por empresa.
- [x] **`GET /contabilidad/asientos/pendientes/:tipo/:id`**: Obtener el detalle y contexto de la operación seleccionada (diferenciando pedagógicamente 5° vs 6° año).
- [ ] **`POST /contabilidad/asientos`** _(Próximo a implementar)_: Registrar nuevo asiento (valida partida doble $\text{Debe} = \text{Haber}$, genera/recupera números de folio automáticos por cuenta y empresa, impacta auditoría).

---

### 📖 Fase 2: Libro Diario (Consulta y Edición)

_Permite consultar la historia de registraciones de la empresa y corregir errores._

- [ ] **`GET /contabilidad/asientos/ultimos`**: Consulta rápida de los últimos $N$ asientos (widget de referencia en la pantalla principal).
- [ ] **`GET /contabilidad/asientos`**: Consulta del Libro Diario completo paginado, ordenado por fecha y con totales calculados al pie.
- [ ] **`GET /contabilidad/asientos/:idAsiento`**: Consultar un asiento específico por ID.
- [ ] **`PATCH /contabilidad/asientos/:idAsiento`**: Modificar renglones e importes de un asiento existente (re-validando partida doble).

---

### 📊 Fase 3: Libro Mayor y Reportes Financieros

_Vistas automáticas de solo lectura generadas a partir de los asientos registrados._

- [ ] **`GET /contabilidad/libro-mayor`**: Agrupa movimientos por cuenta, calcula débitos, créditos y verifica inconsistencias de tipo de saldo.
- [ ] **`GET /contabilidad/estado-resultados`**: Muestra Ingresos vs. Egresos y determina la Ganancia o Pérdida.
- [ ] **`GET /contabilidad/balance-general`**: Presenta la igualdad patrimonial ($\text{Activo} = \text{Pasivo} + \text{Patrimonio Neto}$).

---

## 🎯 Resumen del Avance Actual (Fase 1)

### 🌐 Endpoints Operativos e Implementados

1. **`GET /contabilidad/asientos/tipos-movimiento`**
   - **Propósito:** Provee la fuente de verdad (catálogo) de tipos de movimientos contables para la UI.
   - **Seguridad:** Requiere autenticación y rol `ROLES.ALUMNO`.

2. **`GET /contabilidad/asientos/pendientes`**
   - **Propósito:** Retorna un listado consolidado y paginado (`PaginatedResponse<T>`) de todas las operaciones de la empresa del alumno que aún **no poseen un asiento contable** (`asientoContable === null`).
   - **Filtros:** Ventas, Movimientos Financieros (sin automáticos) y Conciliaciones con diferencia $\neq 0$ (exclusivo 6° año).

3. **`GET /contabilidad/asientos/pendientes/:tipo/:id`**
   - **Propósito:** Carga el detalle específico de una operación pendiente para precargar la pantalla de registración del Libro Diario.
   - **Formatos de `:tipo`:** `VENTA`, `MOVIMIENTO_FINANCIERO`, `CONCILIACION_FINANCIERA`.
   - **Validaciones:**
     - Pertenencia a empresa activa (`NotFoundError`).
     - Sin Asiento previo registrado (`ConflictError`).
     - Conciliación con diferencia $>0$ (`ConflictError`).
     - **Pedagogía por año:** 5° Año solo recibe totales generales; 6° Año recibe además `productos` con su precio unitario de costo.

---

## 🏗️ Patrones de Diseño & Arquitectura Aplicada

### 1. Patrón Strategy (Estrategia)

Se desacopló la lógica de cada operación en estrategias concretas en `src/services/asiento-strategies/`:

- `OperacionPendienteStrategy` (Interfaz común con contexto unificado `OperacionPendienteContext`).
- `VentaAsientoStrategy`: Lógica de negocio y mapeo DTO de ventas.
- `MovimientoAsientoStrategy`: Lógica de negocio y mapeo DTO de movimientos.
- `ConciliacionAsientoStrategy`: Lógica de negocio y mapeo DTO de conciliaciones.
- `asiento-strategy.registry.ts`: Registro dinámico y orquestador.

### 2. Mapeo Mantenible y Type-Safe

- Cada clase `Strategy` incluye su propio método privado de transformación a DTO.
- Se eliminó el tipo `any` reemplazándolo por tipos inferidos de Prisma (`Prisma.PromiseReturnType`), manteniendo **0 advertencias de linter y 100% type-safety**.

---

## 📋 Archivos del Módulo Contable

```text
backend/src/
├── controllers/
│   └── asiento.controller.ts
├── dto/contabilidad/
│   └── asiento.dto.ts
├── repositories/
│   └── asiento.repository.ts
├── routes/
│   └── asiento.routes.ts
├── services/
│   ├── asiento.service.ts
│   └── asiento-strategies/
│       ├── asiento-strategy.interface.ts
│       ├── asiento-strategy.registry.ts
│       ├── venta-asiento.strategy.ts
│       ├── movimiento-asiento.strategy.ts
│       └── conciliacion-asiento.strategy.ts
└── validators/
    └── asiento.validator.ts
```

---

## 🚀 Próximo Paso Inmediato

### Endpoint 4: `POST /contabilidad/asientos` (Creación de Asiento Contable)

- **Validaciones:**
  - Partida doble: $\sum \text{Debe} === \sum \text{Haber}$.
  - Mínimo 2 líneas/renglones por asiento.
- **Funcionalidad:**
  - Asignación de `numeroAsiento` secuencial por empresa.
  - Asignación automática de `FolioCuentaEmpresa` para cuentas contables nuevas.
  - Vinculación con la entidad de origen (`ventaId`, `movimientoFinancieroId` o `conciliacionId`).
  - Ejecución dentro de una transacción atómica (`transactionRepository.ejecutarTransaccion`) con registro de auditoría (`auditLogService`).
