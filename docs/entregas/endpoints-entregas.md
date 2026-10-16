# Especificación de Endpoints: Módulo de Entregas (Alumno)

Este documento define en líneas generales el diseño, responsabilidades y reglas de negocio de los endpoints que componen el módulo de **Entregas de Ejercicios** para los alumnos, integrándose con las decisiones pedagógicas de `docs/ejercicios/Decisiones Ejercicios y correcciones.md` y las convenciones de `docs/GuiaDesarrolloBackend.md`.

---

## 1. Visión General del Módulo

* **Prefijo base:** `/entregas`
* **Rol requerido:** `ALUMNO`
* **Entidades Prisma involucradas:**
  * `EntregaEjercicio`: Registro de cabecera de la entrega del alumno para un ejercicio determinado (`idEntrega`, `ejercicioId`, `alumnoId`, `fechaEntrega`).
  * `ResolucionAlumnoPlantilla`: Contenido estructurado (`contenido: Json`) y estado (`PENDIENTE`, `EN_EDICION`, `COMPLETADA`) de cada plantilla que compone la entrega.
  * `Ejercicio` y `EjercicioPlantilla`: Consignas, fechas límite y plantillas habilitadas por el docente.
  * `Alumno` y `Usuario`: Datos del alumno autenticado y su curso asignado.

---

## 2. Mapa de Endpoints

| Método | Endpoint | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`GET`** | `/entregas` | Tablero principal "Mis ejercicios" del alumno (filtros, paginación y cards resumen). |
| **`GET`** | `/entregas/:ejercicioId` | Detalle del ejercicio y estado/contenido actual de la entrega del alumno. |
| **`PATCH`** | `/entregas/:ejercicioId/plantilla` | Guardar borrador o marcar como completada una plantilla puntual. |
| **`POST`** | `/entregas/:ejercicioId/finalizar` | Entrega definitiva del ejercicio (cierre de edición). |

---

## 3. Detalle de Endpoints

### 3.1. `GET /entregas` — Tablero "Mis ejercicios"
Permite al alumno consultar la lista de ejercicios publicados para su curso y el estado actual de sus entregas.

* **Parámetros de consulta (Query):**
  * `page`: Número de página (default: `1`).
  * `pageSize`: Tamaño de página (default: `10`, máx: `50`).
  * `busqueda`: Filtro por texto en el título del ejercicio (opcional).
  * `docenteId`: Filtro por docente que creó el ejercicio (opcional).
  * `estado`: Filtro según el estado del alumno: `'TODAS' | 'PENDIENTE' | 'EN_PROGRESO' | 'ENTREGADO' | 'CORREGIDO' | 'VENCIDO'` (default: `'TODAS'`).

* **Lógica y Reglas de Negocio:**
  1. Identifica al alumno autenticado y determina su `idCurso`.
  2. Consulta los ejercicios en estado `PUBLICADO` asignados a su curso.
  3. **Cálculo dinámico del estado por alumno:**
     * **`PENDIENTE`:** El alumno no tiene entrega iniciada o todas las plantillas están en `PENDIENTE`.
     * **`EN_PROGRESO`:** El alumno tiene al menos una plantilla en `EN_EDICION` o `COMPLETADA`, pero aún no entregó (`fechaEntrega == null`).
     * **`ENTREGADO`:** El alumno finalizó y envió su resolución (`fechaEntrega != null`), y el docente aún no cerró la corrección.
     * **`CORREGIDO`:** El docente ya finalizó y publicó la corrección (`CorreccionEntrega` asociada).
     * **`VENCIDO`:** La fecha y hora actual superó `fechaLimite` y el alumno no llegó a entregar (`fechaEntrega == null`).
  4. **Cards de Resumen:** Calcula la cantidad de ejercicios en cada uno de los 5 estados para mostrar en el tablero superior.
  5. Retorna la estructura de paginación plana (`items`, `page`, `pageSize`, `totalItems`, `totalPages`) junto con el resumen de contadores.

---

### 3.2. `GET /entregas/:ejercicioId` — Detalle y Resolución de la Entrega
Provee toda la información necesaria para renderizar la pantalla de detalle del ejercicio y la pantalla de trabajo de plantillas (o el modo lectura una vez entregado).

* **Parámetros de ruta (Params):**
  * `ejercicioId`: Identificador numérico del ejercicio.

* **Lógica y Reglas de Negocio:**
  1. Valida que el ejercicio exista, esté `PUBLICADO` y pertenezca al curso del alumno autenticado (de lo contrario, `ForbiddenError` o `NotFoundError`).
  2. Obtiene o inicializa la `EntregaEjercicio` asociada al par `(ejercicioId, alumnoId)`.
  3. Retorna la información consolidada:
     * **Datos del ejercicio:** Título, enunciado, fecha límite, indicaciones opcionales, datos del docente.
     * **Plantillas habilitadas:** Listado de plantillas del ejercicio con su estado individual (`PENDIENTE`, `EN_EDICION`, `COMPLETADA`) y su contenido JSON guardado por el alumno.
     * **Control de edición (`bloqueado`):** Si `fechaEntrega != null`, se marca como bloqueado para que el frontend deshabilite inputs de edición.
     * **Estado de corrección:** Si el ejercicio fue entregado, indica si está pendiente de corrección, en revisión por el docente o si ya cuenta con la corrección disponible.

---

### 3.3. `PATCH /entregas/:ejercicioId/plantilla` — Guardar Borrador / Completar Plantilla
Permite al alumno registrar avances parciales o marcar como completada una plantilla específica (Libro Diario, Libro Mayor, Libro IVA o Hoja de Trabajo).

* **Parámetros de ruta (Params):**
  * `ejercicioId`: Identificador numérico del ejercicio.

* **Cuerpo de la petición (Body):**
  * `tipo`: Tipo de plantilla (`'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'LIBRO_IVA' | 'HOJA_TRABAJO'`).
  * `estado`: Estado de la plantilla (`'EN_EDICION' | 'COMPLETADA'`, default: `'EN_EDICION'`).
  * `contenido`: JSON con la resolución cargada en la plantilla.

* **Lógica y Reglas de Negocio:**
  1. Valida que el ejercicio pertenezca al curso del alumno y que la plantilla esté habilitada en dicho ejercicio.
  2. **Bloqueo posterior a la entrega:** Si la entrega ya tiene `fechaEntrega != null`, rechaza la solicitud con `ConflictError` (*"El ejercicio ya fue entregado y no admite modificaciones"*).
  3. **Principio pedagógico de resolución del alumno:**
     * A diferencia del docente (a quien se le exige balance perfecto para la solución modelo), **al alumno no se le bloquea el guardado por errores contables** (asientos desbalanceados, importes incorrectos, etc.).
     * Se valida únicamente la consistencia estructural del JSON. Los errores conceptuales se preservan para ser evaluados en la corrección automática.
  4. Crea o actualiza el registro en `ResolucionAlumnoPlantilla`.
  5. Retorna el estado actualizado de la plantilla.

---

### 3.4. `POST /entregas/:ejercicioId/finalizar` — Entregar Ejercicio
Acción definitiva que ejecuta el alumno al presionar el botón *"Entregar ejercicio"*.

* **Parámetros de ruta (Params):**
  * `ejercicioId`: Identificador numérico del ejercicio.

* **Lógica y Reglas de Negocio:**
  1. Valida que el ejercicio pertenezca al curso del alumno.
  2. Valida que la entrega no haya sido enviada previamente (`fechaEntrega == null`). Si ya fue entregada, rechaza con `ConflictError`.
  3. **Validación de completitud:**
     * Verifica que **todas** las plantillas habilitadas en el ejercicio se encuentren en estado `COMPLETADA`.
     * Si alguna plantilla falta completar, rechaza con `BadRequestError` (*"Debe completar todas las plantillas antes de enviar la entrega"*).
  4. **Registro de entrega:**
     * Asigna la marca temporal actual: `fechaEntrega = new Date()`.
  5. **Manejo de entregas fuera de término:**
     * Si `fechaEntrega > ejercicio.fechaLimite`, se permite la entrega pero queda registrado que se entregó fuera de término para que el docente pueda visualizarlo en su panel.
  6. Bloquea permanentemente la edición para el alumno.
  7. Retorna la confirmación de la entrega realizada.

