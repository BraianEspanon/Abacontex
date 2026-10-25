# Especificación de Endpoints y Manejo de IA: Módulo de Correcciones

Este documento define el diseño arquitectónico, el mapa de endpoints REST, las reglas de negocio y la estrategia integral de Inteligencia Artificial para el **Módulo de Correcciones (Docente y Alumno)** de Abacontex, conforme a `docs/ejercicios/Decisiones Ejercicios y correcciones.md`, `docs/GuiaDesarrolloBackend.md` y `docs/prompt-ia.md`.

---

## 1. Visión General del Módulo

* **Prefijos base:**
  * Docente: `/correcciones`
  * Alumno: `/entregas/:ejercicioId/correccion`
* **Roles requeridos:**
  * `DOCENTE` (para gestión de revisiones, corrección de entregas y análisis global).
  * `ALUMNO` (para consulta de su propia corrección finalizada).
* **Entidades Prisma involucradas:**
  * `CorreccionEntrega`: Cabecera de la corrección asignada a una entrega (`idCorreccion`, `entregaId`, `docenteId`, `retroalimentacion`, `fechaCorreccion`).
  * `CorreccionPlantilla`: Estado de corrección de cada plantilla del ejercicio (`PENDIENTE` o `CORREGIDA`).
  * `ErrorCorreccion`: Registro estructurado de discrepancias contables detectadas por el motor determinista (`idError`, `correccionId`, `ejercicioPlantillaId`, `tipoError`, `detalle: Json`, `comentarioDocente`).
  * `EntregaEjercicio` y `ResolucionAlumnoPlantilla`: La entrega del alumno sujeta a revisión.
  * `Ejercicio` y `EjercicioPlantilla`: La consigna y la solución modelo del docente.
  * `DiagnosticoCurso` *(Nueva entidad propuesta)*: Persistencia del diagnóstico pedagógico por curso generado con IA y su snapshot estadístico.

---

## 2. Mapa General de Endpoints

### 2.1. Submenú 1: Ejercicios a Corregir (Tablero Docente)

| Método | Endpoint | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`GET`** | `/correcciones/ejercicios` | Tablero de ejercicios con entregas (cards horizontales, filtros por curso/estado, contadores resumen y paginación). |
| **`GET`** | `/correcciones/filtros` | Opciones de filtros para el tablero docente (cursos asignados al docente y estados de corrección). |
| **`GET`** | `/correcciones/ejercicios/:ejercicioId/entregas` | Listado de alumnos y entregas de un ejercicio específico (con estados: `PENDIENTE`, `EN_CORRECCION`, `CORREGIDA`). |

### 2.2. Submenú 1.1: Pantalla "Corrección del Ejercicio" (Espacio de Trabajo)

| Método | Endpoint | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`GET`** | `/correcciones/entregas/:entregaId` | Carga el espacio de trabajo completo de la entrega: comparación alumno vs docente en memoria, KPIs (aciertos, diferencias, incompletos), celdas observadas y borrador existente. |
| **`PATCH`** | `/correcciones/entregas/:entregaId/plantillas/:plantillaId` | Marca una plantilla individual como revisada (`PENDIENTE` o `CORREGIDA`). |
| **`PATCH`** | `/correcciones/entregas/:entregaId/errores/:errorId/comentario` | Guarda o edita una observación puntual del docente sobre un error contable específico. |
| **`PATCH`** | `/correcciones/entregas/:entregaId/borrador` | Guarda avances parciales del docente (retroalimentación general de hasta 500 caracteres) sin cerrar la entrega. |
| **`POST`** | `/correcciones/entregas/:entregaId/finalizar` | Cierre definitivo y envío de la corrección. Valida que todas las plantillas estén marcadas como corregidas y notifica al alumno. |
| **`POST`** | `/correcciones/entregas/:entregaId/sugerir-retroalimentacion` | **Asistencia IA (Bajo Demanda):** Genera una sugerencia de retroalimentación individual (máx. 500 caracteres) basada en los errores detectados (habilitado únicamente si hay **3 o más errores**). |

### 2.3. Submenú 2: Análisis de Errores (Panel Global por Curso)

| Método | Endpoint | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`GET`** | `/correcciones/analisis-errores/cursos` | Lista los cursos a los que el docente tiene acceso para poblar los selectores superiores (`6° II`, `6° III`). |
| **`GET`** | `/correcciones/cursos/:cursoId/analisis-errores` | Métricas y analíticas globales del curso calculadas en vivo en < 20 ms (KPIs, gráfico de barras, patrones, alumnos más afectados, distribución por plantilla) + último diagnóstico IA guardado. |
| **`POST`** | `/correcciones/cursos/:cursoId/sugerir-refuerzo` | **Asistencia IA (Bajo Demanda Inteligente):** Genera o actualiza el diagnóstico pedagógico y temas a reforzar del curso. Protegido contra spam por regla de cambio de tendencia. |

### 2.4. Vista Alumno: Consulta de Corrección

| Método | Endpoint | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`GET`** | `/entregas/:ejercicioId/correccion` | Permite al alumno ver su ejercicio corregido: retroalimentación del docente, celdas observadas y comentarios puntuales (en modo solo lectura). |

---

## 3. Especificación Detallada de Endpoints

### 3.1. `GET /correcciones/ejercicios` — Tablero de Correcciones
* **Query Params:** `page` (default 1), `pageSize` (default 6), `busqueda` (opcional), `cursoId` (opcional), `estado` (`TODAS | SIN_ENTREGAS | PENDIENTE | EN_CORRECCION | CORREGIDO`).
* **Lógica:**
  1. Filtra los ejercicios creados por el docente autenticado que se encuentren publicados (`PUBLICADO` o `FINALIZADO`).
  2. Determina el estado de corrección del ejercicio según las entregas recibidas:
     * `SIN_ENTREGAS`: El ejercicio fue publicado, pero ningún alumno entregó todavía (`totalEntregasRecibidas === 0`).
     * `PENDIENTE`: Hay entregas recibidas de alumnos, pero el docente todavía no inició la corrección de ninguna.
     * `EN_CORRECCION`: Al menos una entrega fue corregida o iniciada con borrador, pero quedan entregas pendientes de revisar.
     * `CORREGIDO`: El 100% de las entregas recibidas hasta el momento ya fueron finalizadas.
  3. Calcula contadores resumen para las tarjetas superiores (`total`, `sinEntregas`, `pendientes`, `enCorreccion`, `corregidos`).
  4. Retorna paginación plana (`items`, `page`, `pageSize`, `totalItems`, `totalPages`) y contadores.

### 3.2. `GET /correcciones/filtros` — Opciones de Filtros para el Tablero
* **Query/Path Params:** Ninguno (utiliza el docente autenticado `req.user`).
* **Lógica:**
  1. Identifica al docente autenticado.
  2. Consulta los cursos asignados al docente (`docenteRepository.findCursosByDocente`).
  3. Retorna la lista de cursos (`idCurso`, `nombreCurso`) y las opciones de estado de corrección (`clave`, `label`) para poblar los selects del frontend.

### 3.3. `GET /correcciones/ejercicios/:ejercicioId/entregas` — Lista de Entregas del Ejercicio
* **Path Params:** `ejercicioId` (número entero).
* **Lógica:**
  1. Valida que el ejercicio pertenezca al docente.
  2. Retorna la lista de entregas de los alumnos con:
     * Datos del alumno (nombre, apellido, iniciales/avatar).
     * Fecha y hora de entrega (y badge si fue fuera de término).
     * Estado de corrección individual (`PENDIENTE`, `EN_CORRECCION`, `CORREGIDA`).
     * Cantidad de plantillas revisadas sobre el total (ej: `2/3`).

### 3.3. `GET /correcciones/entregas/:entregaId` — Espacio de Trabajo de Corrección
* **Path Params:** `entregaId` (número entero).
* **Lógica y Principio Pedagógico:**
  1. Carga la resolución del alumno (`ResolucionAlumnoPlantilla[]`) y la solución modelo del docente (`EjercicioPlantilla.contenido`).
  2. **Motor de Comparación Determinista en Memoria (< 20 ms):**
     * Compara cuentas utilizadas, importes, Debe vs Haber, asientos desbalanceados, totales y clasificaciones.
     * Genera la lista de `ErrorCorreccion` con celdas y filas específicas señaladas.
  3. **Cálculo de KPIs y Conteo de Errores:**
     * `aciertos`: Cantidad de renglones/asientos resueltos de forma idéntica a la solución modelo.
     * `diferenciasDetectadas`: Cantidad de importes o cuentas con discrepancia.
     * `asientosIncompletos`: Asientos desbalanceados o con cuentas faltantes.
     * `totalErrores`: Suma total de errores detectados en la entrega.
  4. **Control del Botón de Asistencia IA:**
     * `puedeSugerirIa: boolean` (`true` si `totalErrores >= 3`, `false` en caso contrario).
     * `motivoDeshabilitadoIa: string | null` (ej: *"Se requieren al menos 3 errores detectados para habilitar la sugerencia pedagógica con IA"*, o `null` si está habilitado).
  5. Retorna la estructura lista para renderizar:
     * Cabecera del alumno y entrega (nombre, curso, fecha entrega, plantillas resueltas).
     * KPIs de corrección con `totalErrores`.
     * Control del botón: `{ puedeSugerirIa, motivoDeshabilitadoIa }`.
     * Plantillas del alumno con celdas observadas en rojo/alerta y comentarios puntuales.
     * Borrador actual de la retroalimentación docente (si existe).

### 3.4. `PATCH /correcciones/entregas/:entregaId/plantillas/:plantillaId` — Revisión de Plantilla
* **Path Params:** `entregaId`, `plantillaId`.
* **Body:** `{ estado: 'PENDIENTE' | 'CORREGIDA' }`.
* **Lógica:** Permite al docente marcar como revisada una plantilla puntual (ej. finalizó Libro Diario pero deja Libro Mayor para después). Actualiza `CorreccionPlantilla`.

### 3.5. `PATCH /correcciones/entregas/:entregaId/borrador` — Guardar Borrador
* **Path Params:** `entregaId`.
* **Body:** `{ retroalimentacion?: string }` (validado a máx. 500 caracteres).
* **Lógica:** Guarda el avance de la retroalimentación sin cerrar la entrega ni notificar al alumno.

### 3.6. `POST /correcciones/entregas/:entregaId/finalizar` — Enviar Corrección
* **Path Params:** `entregaId`.
* **Body:** `{ retroalimentacion?: string }` (opcional, máx. 500 caracteres).
* **Lógica y Reglas de Negocio:**
  1. **Validación de Completitud Obligatoria:** Verifica que **todas** las plantillas habilitadas en el ejercicio estén marcadas como `CORREGIDA`. Si falta alguna, rechaza con `ConflictError` (*"Debe marcar todas las plantillas como corregidas antes de enviar"*).
  2. Registra `fechaCorreccion = new Date()`.
  3. Persiste definitivamente los errores detectados en `ErrorCorreccion`.
  4. Dispara una notificación al alumno (en base de datos y vía Socket.IO en tiempo real): *"Tu ejercicio [Título] ha sido corregido"*.

### 3.7. `GET /correcciones/cursos/:cursoId/analisis-errores` — Panel Global de Análisis de Errores
* **Path Params:** `cursoId` (número entero).
* **Lógica y Respuesta:**
  1. Valida que el docente tenga asignado el curso solicitado.
  2. **Cálculo Determinista en Vivo (< 20 ms):** Agrupa todos los `ErrorCorreccion` de las entregas de ejercicios de ese curso para armar:
     * `kpis`: Entregas analizadas, error más frecuente, alumnos afectados, plantilla con más errores.
     * `erroresFrecuentes`: Porcentajes de ocurrencia para el gráfico de barras.
     * `patronesDetectados`: Tabla de tipos de errores, cantidad de ejercicios y alumnos afectados.
     * `alumnosMasAfectados`: Ranking de alumnos con mayor cantidad de errores.
     * `distribucionPlantillas`: Desglose de errores por Libro Diario, Mayor, Hoja de Trabajo e IVA.
  3. **Diagnóstico IA y Control del Botón en Frontend:**
     * Obtiene el último registro de `DiagnosticoCurso` para el par `(cursoId, docenteId)`.
     * Ejecuta `hayCambioDeTendencia(snapshot, metricasActuales)`.
     * Retorna el bloque `diagnosticoIa` con flags para gobernar el botón de la UI sin necesidad de endpoints adicionales:
       ```json
       {
         "diagnosticoIa": {
           "resumen": "Los ejercicios analizados muestran...",
           "cosasAReforzar": [
             "Diferenciar claramente entre IVA Débito Fiscal e IVA Crédito Fiscal."
           ],
           "fechaGeneracion": "2026-10-18T14:30:00.000Z",
           "puedeGenerar": false,
           "motivoDeshabilitado": "El diagnóstico actual se encuentra vigente. No se detectaron cambios en la tendencia de errores del curso."
         }
       }
       ```
     * Si no hay diagnóstico previo ni suficientes datos:
       `diagnosticoIa: null`, `puedeGenerar: false`, `motivoDeshabilitado: "Aún no hay suficiente información analizada para generar el resumen."`

### 3.8. `POST /correcciones/cursos/:cursoId/sugerir-refuerzo` — Generar / Actualizar Diagnóstico de Curso
* **Path Params:** `cursoId` (número entero).
* **Lógica y Reglas de Negocio:**
  1. Valida permisos del docente sobre el curso.
  2. Ejecuta el algoritmo determinista `hayCambioDeTendencia(snapshot, actual)`.
  3. **Protección Anti-Spam (Zero Trust):** Si `hayCambioDeTendencia === false` y ya existe un diagnóstico previo, rechaza inmediatamente con `400 Bad Request` (*"No se detectaron variaciones en la tendencia de errores que justifiquen una nueva generación"*).
  4. Si hay cambio o es la primera vez (con $\ge 10$ errores mínimos):
     * Envía a Gemini el resumen de patrones.
     * Solicita la estructura `{ resumenGeneral: string, cosasAReforzar: string[] }`.
     * Realiza un `upsert` en `DiagnosticoCurso` actualizando el contenido y la nueva foto del snapshot (`totalErroresEnSnapshot`, `distribucionEnSnapshot`, etc.).
     * Retorna el diagnóstico generado.

### 3.9. `GET /entregas/:ejercicioId/correccion` — Consulta de Corrección (Alumno)
* **Path Params:** `ejercicioId` (número entero).
* **Lógica:**
  1. Valida que el alumno pertenezca al curso del ejercicio y que la entrega esté en estado `CORREGIDA` (`fechaCorreccion != null`).
  2. Retorna en modo solo lectura:
     * Retroalimentación general del docente.
     * Plantillas resueltas con celdas observadas en rojo/alerta.
     * Comentarios puntuales que el docente haya registrado sobre cada error específico.

---

## 4. Estrategia Integral de Asistencia con IA (Google Gemini)

La utilización de Inteligencia Artificial en Abacontex sigue un criterio estricto de **optimización de costos, control docente (*human-in-the-loop*) y cero fallos bloqueantes**.

```
                           MATRIZ DE RESPONSABILIDADES
┌───────────────────────────────────────┬───────────────────────────────────────┐
│     MOTOR DETERMINISTA (TypeScript)   │         ASISTENTE IA (Gemini)         │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Detección de errores contables      │ • Redacción de devolución individual  │
│ • Comparación Debe / Haber / Saldos   │   pedagógica (< 500 caracteres).      │
│ • Cálculo de KPIs y porcentajes       │ • Diagnóstico pedagógico global y     │
│ • Gráficos de barras y rankings       │   temas a reforzar para la clase.     │
│ • CERO TOKENS - Latencia < 20 ms      │ • Solo bajo demanda o hito semanal.   │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

### 4.1. Caso A: Retroalimentación Individual de la Entrega

* **Endpoint:** `POST /correcciones/entregas/:entregaId/sugerir-retroalimentacion`
* **Comportamiento y Regla de Umbral:**
  1. El backend evalúa la lista de `ErrorCorreccion` ya detectados por el motor determinista.
  2. **Regla de guardia estricta (< 3 errores):** 
     * Si la entrega tiene **menos de 3 errores** (0, 1 o 2 errores), **NO se permite el uso de IA**.
     * Si hay 0 errores: el ejercicio se encuentra correcto.
     * Si hay 1 o 2 errores: son errores puntuales o simples (ej. un asiento desbalanceado o una diferencia numérica). El docente puede escribir una indicación breve a mano o el sistema muestra un mensaje estándar sin costo de API.
     * Si se invoca el endpoint con $< 3$ errores, el backend responde con `400 Bad Request` (*"La sugerencia con IA requiere al menos 3 errores detectados"*).
  3. **Generación con IA ($\ge 3$ errores):**
     * Si la entrega presenta **3 o más errores** conceptuales o numéricos, el botón se habilita en la interfaz.
     * Se envía a Gemini únicamente el resumen estructurado de los errores detectados (sin JSONs de plantillas completas para reducir consumo de tokens).
     * Gemini devuelve una devolución pedagógica integradora y formativa (máx. 500 caracteres).
  4. El texto se devuelve al frontend y se inserta en el `textarea` editable para que el docente lo revise, ajuste o apruebe antes de guardar o enviar la corrección.

---

### 4.2. Caso B: Diagnóstico Pedagógico del Curso ("Análisis de Errores")

En la pantalla de *Análisis de errores*, el docente observa un resumen consolidado de las dificultades de todo un curso (`6° II`, `6° III`).

#### Modelo de Persistencia en Base de Datos: `DiagnosticoCurso`

Para no re-generar el diagnóstico en cada visita y evitar un consumo descontrolado de tokens, se persiste la última respuesta junto con una "foto" (*snapshot*) de las estadísticas:

```prisma
model DiagnosticoCurso {
  idDiagnostico Int      @id @default(autoincrement())

  cursoId       Int
  curso         Curso    @relation(fields: [cursoId], references: [idCurso], onDelete: Cascade)

  docenteId     String
  docente       Usuario  @relation(fields: [docenteId], references: [id])

  // Contenido pedagógico devuelto por Gemini
  resumenGeneral String   @db.Text
  cosasAReforzar Json     // Array de strings: ["Diferenciar IVA Débito de Crédito", ...]

  // Snapshot de la tendencia al momento de generar
  totalErroresEnSnapshot       Int
  errorPrincipalEnSnapshot     String
  plantillaPrincipalEnSnapshot String
  distribucionEnSnapshot       Json  // Ej: { "IVA_DEBITO_CREDITO": 34, "DEBE_HABER_INVERTIDO": 27 }

  updatedAt     DateTime @updatedAt @db.Timestamptz(3)

  @@unique([cursoId, docenteId])
  @@map("diagnosticos_cursos")
}
```

---

#### Algoritmo Determinista: `hayCambioDeTendencia(...)`

Tanto el scheduler automático como el endpoint manual ejecutan la misma función de análisis de tendencia matemática sobre los errores actuales vs. el snapshot guardado:

1. **Regla 0 (Significancia Estadística):** Debe haber al menos $\ge 10$ errores nuevos analizados desde el último snapshot. Si no se alcanza este volumen, se descarta cualquier cambio por considerarse ruido o muestra insuficiente.
2. **Regla 1 (Cambio de Error Líder):** El tipo de error `#1` actual es diferente al `errorPrincipalEnSnapshot`.
3. **Regla 2 (Nuevo Error Emergente):** Un error que representaba $< 5\%$ en el snapshot ahora supera el $15\%$ del total.
4. **Regla 3 (Variación Porcentual Drástica):** La proporción de algún error varió en $\ge 15$ puntos porcentuales ($\Delta \ge 15\%$).
5. **Regla 4 (Cambio de Plantilla Crítica):** La plantilla con mayor concentración de errores cambió (ej. de `Libro Diario` a `Hoja de Trabajo`).

> Si se supera la **Regla 0** y se cumple **cualquiera de las Reglas 1 a 4**, la función determina: `hayCambioDeTendencia = true`.

---

#### Flujo Dual Compartido: Cron Semanal + Botón Inteligente

```
                          ┌──────────────────────────────────────────────┐
                          │    ¿HAY CAMBIO EN LA TENDENCIA DE ERRORES?   │
                          │        hayCambioDeTendencia(...)             │
                          └──────────────────────┬───────────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ SÍ                                              │ NO
                        ▼                                                 ▼
        ┌───────────────────────────────┐                 ┌───────────────────────────────┐
        │ • Cron Semanal: Genera con IA │                 │ • Cron Semanal: No hace nada  │
        │ • Botón UI: Habilitado (Verde)│                 │ • Botón UI: Deshabilitado     │
        │ • Backend POST: Permite 200 OK│                 │ • Backend POST: Rechaza 400   │
        └───────────────────────────────┘                 └───────────────────────────────┘
```

1. **Flujo Automático (Cron Semanal):**
   * Corre los **domingos a las 23:00 hs** (`diagnostico.scheduler.ts` con `node-cron`).
   * Evalúa los cursos activos del docente. Si `hayCambioDeTendencia === true`, consulta a Gemini y actualiza `DiagnosticoCurso` con el nuevo snapshot. Si no cambió, no gasta tokens.
   * El docente llega el lunes con el diagnóstico actualizado listo para planificar la semana escolar.

2. **Flujo Manual Inteligente (Botón UI y Endpoint `POST`):**
   * **Endpoint:** `POST /correcciones/cursos/:cursoId/sugerir-refuerzo`
   * **En la UI:** 
     * Si no hay cambios de tendencia, el botón aparece **deshabilitado** con el mensaje: *"El diagnóstico actual se encuentra vigente."*
     * Si se detecta un cambio de tendencia durante la semana (antes del domingo), el botón se **habilita** para que el docente lo actualice en el momento si lo desea.
   * **En el Backend (*Zero Trust*):** Si se invoca el endpoint cuando `hayCambioDeTendencia === false` (intento de spam o forzado indebido), el backend rechaza con `400 Bad Request`:
     > *"No se detectaron variaciones en la tendencia de errores que justifiquen una nueva generación."*

---

## 5. Resumen de Respuestas y Manejo de Errores

| Código | Significado | Escenario de Aplicación |
| :--- | :--- | :--- |
| **`200 OK`** | Operación exitosa | Lectura de datos, KPIs deterministas y diagnósticos guardados. |
| **`201 Created`** | Generación exitosa | Creación o actualización bajo demanda de asistencia con IA. |
| **`400 Bad Request`** | Parámetros inválidos / Spam | Intentar generar diagnóstico de curso sin cambio de tendencia o con datos insuficientes. |
| **`403 Forbidden`** | Sin autorización | El docente intenta acceder a un curso o entrega que no le pertenece. |
| **`404 Not Found`** | Recurso inexistente | Entrega, ejercicio o curso no encontrado. |
| **`409 Conflict`** | Conflicto de estado | Intentar finalizar la corrección sin haber marcado todas las plantillas como corregidas. |
| **`503 Service Unavailable`** | Fallo del proveedor externo | La API de Gemini no responde o excedió cuota. El sistema contable no se bloquea; se emite alerta al usuario para que continúe la corrección manual. |

