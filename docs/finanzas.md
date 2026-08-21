# Arquitectura del Módulo de Finanzas

## Objetivo

El módulo de finanzas está diseñado siguiendo una arquitectura orientada a la interfaz de usuario (UI), priorizando el rendimiento mediante la separación de responsabilidades.

El panel principal (Dashboard) consta de múltiples pestañas que comparten componentes visuales (cabezales). Para evitar recalcular información global innecesariamente al cambiar de página en las tablas, los datos agregados (indicadores/resumen) se sirven desde endpoints separados de los datos tabulares o gráficos.

---

# Flujo general del Dashboard

```text
Pantalla de Finanzas
      │
      ├── Pestaña 1: Flujo de fondos
      │     ├── Cabezal: GET /finanzas/resumen
      │     └── Cuerpo:  GET /finanzas/grafico?periodo=...
      │
      ├── Pestaña 2: Movimientos
      │     ├── Cabezal: GET /finanzas/resumen (Cacheado de la Pestaña 1)
      │     └── Cuerpo:  GET /finanzas/movimientos?page=1...
      │
      └── Pestaña 3: Conciliación financiera
            ├── Cabezal: GET /finanzas/conciliaciones/resumen (Cabezal independiente)
            └── Cuerpo:  GET /finanzas/conciliaciones?page=1...
```

Esta simetría permite que el Frontend cargue cada componente por separado, mejorando la experiencia de usuario y reduciendo la carga en la base de datos al paginar tablas.

---

# 1. Movimientos Financieros

## Categorías y Tipos

Para poblar los formularios y filtros de manera dinámica, se exponen dos endpoints de catálogos fijos:

### GET /finanzas/tipos-movimiento
Devuelve los tipos raíz (ej. `INGRESO`, `EGRESO`).

### GET /finanzas/categorias
Devuelve las categorías disponibles agrupadas por su tipo de movimiento (ej. Ventas, Compras, Pago a proveedores).

---

## Resumen General (Cabezal)

```http
GET /finanzas/resumen
```

Responsabilidad:
- Alimentar las 4 tarjetas superiores fijas (Total Ingresos, Total Egresos, Flujo Neto, Mes Actual).
- Siempre calcula los acumulados basados en el **Año Académico** actual asociado a la empresa del alumno.
- Este endpoint se consulta una sola vez y su respuesta se comparte entre la Pestaña 1 y Pestaña 2.

Respuesta esperada:
```json
{
  "totalIngresos": 150000.00,
  "totalEgresos": 30000.00,
  "flujoNeto": 120000.00,
  "mesActual": {
    "ingresos": 50000.00,
    "egresos": 10000.00
  }
}
```

---

## Gráfico de Flujo de Fondos

```http
GET /finanzas/grafico?periodo=...
```

Responsabilidad:
- Devolver los datos matemáticamente agrupados y listos para ser renderizados por la librería de gráficos del frontend.
- Filtros soportados por Query Params:
  - `?periodo=mes`: Devuelve el mes actual agrupado **por días** (ej. 1 Ago, 2 Ago... 31 Ago). Ideal para vista detallada de ~30 puntos.
  - `?periodo=6meses`: Devuelve los últimos 6 meses (incluyendo el actual) agrupados **por mes**.
  - `?periodo=ciclo` (Por defecto): Devuelve los 12 meses del ciclo lectivo actual agrupados **por mes**.

Respuesta esperada (`?periodo=6meses`):
```json
[
  { "label": "Mar 26", "ingresos": 15000, "egresos": 2000 },
  { "label": "Abr 26", "ingresos": 30000, "egresos": 5000 }
]
```

---

## Historial de Movimientos

```http
GET /finanzas/movimientos
```

Responsabilidad:
- Devolver la lista paginada para la tabla de la Pestaña 2.
- Acepta filtros opcionales como `?mes=8` y `?idTipoMovimiento=1`.
- Los datos vienen aplanados mediante un DTO (`MovimientoFinancieroMapper`) para facilitar su lectura directa en la tabla (sin anidamientos excesivos).

Respuesta esperada:
```json
{
  "items": [
    {
      "idMovimiento": 13,
      "fecha": "2026-08-21T02:56:59.459Z",
      "concepto": "Venta de prueba",
      "importe": 1000,
      "categoria": "VENTA",
      "tipoMovimiento": "INGRESO",
      "idTipoMovimiento": 1,
      "metodoPago": "Efectivo"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalItems": 21,
  "totalPages": 3
}
```

---

# 2. Conciliaciones Financieras (Próximamente)

El flujo de conciliación mantiene la misma simetría de componentes, pero con sus propios endpoints debido a que sus reglas de negocio e indicadores son únicos de la Pestaña 3.

### GET /finanzas/conciliaciones/resumen
- **Doble propósito:** 
  1. Alimenta las 3 tarjetas superiores específicas de esta pestaña (Saldo según sistema, Movimientos del periodo, Última conciliación).
  2. Alimenta el campo inmodificable "Saldo según sistema" dentro del formulario central. El Frontend llama a este endpoint una sola vez y distribuye la data a ambos componentes.

### POST /finanzas/conciliaciones
- Guarda el registro de la conciliación.
- **Importante:** Calcula la diferencia real en el backend y genera automáticamente el movimiento financiero de ajuste (Ingreso/Egreso por diferencia de caja) para cuadrar el sistema.

### GET /finanzas/conciliaciones
- Devuelve el historial paginado (`PaginatedResponse`) de las conciliaciones pasadas para renderizar la tabla inferior.

---

# Notas de implementación para el Frontend

- **Ausencia de Paginación en Gráficos:** Los endpoints de gráficos y resumen devuelven la totalidad de la información procesada. No requieren parámetros de paginación.
- **Tipado seguro:** Todos los importes financieros (moneda) llegan al frontend como números nativos (`Number`), por lo que pueden ser introducidos directamente en funciones de formateo (ej. `Intl.NumberFormat`).
- **Estado de Pestañas:** Se recomienda que los llamados a `GET /finanzas/resumen` se realicen a nivel de la página contenedora para que la caché de React Query (o la herramienta utilizada) mantenga los valores intactos al transicionar entre Flujo de fondos y Movimientos.
