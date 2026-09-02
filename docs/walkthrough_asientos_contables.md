# 📚 Walkthrough & Roadmap: Módulo de Asientos Contables (Abacontex ERP)

> **Estado del Proyecto:** `npm run check` pasando con **0 errores** (ESLint, Jest, Prettier y TypeScript build completados exitosamente).

---

## 🗺️ Mapa Completo del Módulo por Fases

### 🚀 Fase 1: Catálogos y Carga de Asientos Contables (Core)

_Es el bloque principal necesario para que los alumnos puedan cargar y validar asientos en la plataforma._

- [x] **`GET /contabilidad/asientos/tipos-movimiento`**: Catálogo de variaciones patrimoniales ($A+$, $A-$, $P+$, etc.) para los desplegables del frontend.
- [x] **`GET /contabilidad/asientos/cuentas`**: Catálogo de cuentas contables activas enriquecido con el número de folio de la empresa y el `proximoFolioDisponible`.
- [x] **`GET /contabilidad/asientos/resumen`**: Resumen de métricas superiores (`asientosRegistradosCount` y `pendientesRegistrarCount`) para las tarjetas del panel contable.
- [x] **`GET /contabilidad/asientos/pendientes`**: Consulta de operaciones comerciales (ventas, movimientos financieros, conciliaciones) pendientes de registrar por empresa.
- [x] **`GET /contabilidad/asientos/pendientes/:tipo/:id`**: Obtener el detalle y contexto de la operación seleccionada (diferenciando pedagógicamente 5° vs 6° año).
- [x] **`POST /contabilidad/asientos`**: Registrar nuevo asiento contable (valida partida doble $\text{Debe} = \text{Haber}$, autogestiona folios contables por cuenta y empresa, asigna `numeroAsiento` secuencial, deriva la fecha de la operación origen y registra auditoría).

---

### 📖 Fase 2: Libro Diario (Consulta y Edición)

_Permite consultar la historia de registraciones de la empresa y corregir errores._

- [x] **`GET /contabilidad/asientos/ultimos`** (y `GET /contabilidad/asientos`): Consulta rápida de los últimos $N$ asientos registrados ordenados por `createdAt: 'desc'` (widget de la pantalla principal).
- [x] **`GET /contabilidad/asientos/libro-diario`**: Consulta del Libro Diario completo en orden cronológico ascendente (`createdAt: 'asc'`), incluyendo folios, variaciones patrimoniales ($A+$, $R-$, etc.) y totales acumulados al pie (`totalDebeGeneral` y `totalHaberGeneral`).
- [x] **`GET /contabilidad/asientos/:idAsiento`**: Consultar un asiento específico por ID para la pantalla de edición o vista detallada.
- [x] **`PATCH /contabilidad/asientos/:idAsiento`**: Modificar renglones e importes de un asiento existente (re-validando partida doble, asignando folios para nuevas cuentas y registrando auditoría).

---

### 📊 Fase 3: Libro Mayor y Reportes Financieros

_Vistas automáticas de solo lectura generadas a partir de los asientos registrados._

- [ ] **`GET /contabilidad/libro-mayor`**: Agrupa movimientos por cuenta, calcula débitos, créditos y verifica inconsistencias de tipo de saldo.
- [ ] **`GET /contabilidad/estado-resultados`**: Muestra Ingresos vs. Egresos y determina la Ganancia o Pérdida.
- [ ] **`GET /contabilidad/balance-general`**: Presenta la igualdad patrimonial ($\text{Activo} = \text{Pasivo} + \text{Patrimonio Neto}$).

---

## 🎯 Resumen del Avance Actual (Fase 1 Completada 🎉)

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

4. **`POST /contabilidad/asientos`**
   - **Propósito:** Registra un nuevo asiento contable en el Libro Diario.
   - **Validaciones:**
     - Partida doble: $\sum \text{Debe} === \sum \text{Haber}$.
     - Renglones: Mínimo 2 renglones, cada uno con importe exclusivo en Debe o en Haber.
   - **Funcionalidad:**
     - **Seguridad de Fecha:** Deriva la fecha automáticamente de la operación comercial de origen en BD o asigna la fecha actual si es `AJUSTE`.
     - **Secuencialidad:** Genera automáticamente el `numeroAsiento` consecutivo por empresa.
     - **Gestión de Folios:** Genera/recupera automáticamente el `FolioCuentaEmpresa` para cada cuenta utilizada.
     - **Transacción Atómica:** Ejecución dentro de `transactionRepository.ejecutarTransaccion` e integración con `auditLogService`.

---

## 🏗️ Patrones de Diseño & Arquitectura Aplicada

### 1. Patrón Strategy (Estrategia)

Se desacopló la lógica de cada operación en estrategias concretas en `src/services/asiento-strategies/`:

- `OperacionPendienteStrategy` (Interfaz común con contexto unificado `OperacionPendienteContext`).
- `VentaAsientoStrategy`: Lógica de negocio, mapeo DTO de ventas y extracción de fecha/FK.
- `MovimientoAsientoStrategy`: Lógica de negocio, mapeo DTO de movimientos y extracción de fecha/FK.
- `ConciliacionAsientoStrategy`: Lógica de negocio, mapeo DTO de conciliaciones y extracción de fecha/FK.
- `asiento-strategy.registry.ts`: Registro dinámico y orquestador.

### 2. Mapeo Mantenible y Type-Safe

- Cada clase `Strategy` incluye su propio método de transformación y validación.
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

### Endpoint 5: `GET /contabilidad/asientos/ultimos` (Consulta de últimos asientos para la pantalla principal)
