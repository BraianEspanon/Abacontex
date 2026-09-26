# Roadmap y Decisiones de Implementación Backend — Módulo Ejercicios (Docente)

> **Documento de referencia para el desarrollo backend del módulo de Ejercicios contables en Abacontex.**  
> Basado en las definiciones de `docs/ejercicios/Decisiones Ejercicios y correcciones.md`, las convenciones de `docs/GuiaDesarrolloBackend.md` y las reglas de `docs/prompt-ia.md`.

---

## 1. Alcance y Enfoque

El desarrollo se organiza de forma incremental por fases:

* **Fase 1 (Alcance actual): Módulo Docente**  
  Comprende la creación, configuración, digitalización/generación, listado ("Mis ejercicios"), detalle y carga de la resolución modelo por parte del docente.
* **Fase 2 y 3 (Etapa posterior): Alumnos, Entregas y Correcciones**  
  Comprenderá la resolución de ejercicios por parte de los alumnos, la corrección automática comparativa, la interpretación pedagógica con IA y las métricas de errores frecuentes.

---

## 2. Acuerdos y Decisiones Técnicas Consolidadas

### 2.1. Creación Híbrida y Agnóstica (Opción 2)
* Se utiliza un **único endpoint de guardado** (`POST /ejercicios`) tanto para ejercicios creados con IA como para los digitalizados (OCR) o cargados manualmente.
* **Metadata de IA opcional:** El payload de creación admite el objeto opcional `generacionIA`.
  * Si el docente usó el flujo de IA, se envían y persisten los parámetros (`tipoEjercicio`, `dificultad`, `contenidosAdicionales`, `contextoAdicional`) en la tabla `GeneracionEjercicioIA`.
  * Si fue digitalizado o manual, `generacionIA` queda en `null`.
* En la consulta de detalle (`GET /ejercicios/:id`):
  * `ejercicio.generacionIA !== null` $\rightarrow$ **Origen: IA** (se exponen los chips de dificultad, tipo y contenidos).
  * `ejercicio.generacionIA === null` $\rightarrow$ **Origen: Digitalizado** (se expone como ejercicio digitalizado sin parámetros de IA).

### 2.2. Digitalización Liviana (Sin almacenamiento de imagen)
* La imagen o PDF subido en `POST /ejercicios/digitalizar` se procesa en memoria mediante OCR (Gemini Vision) para extraer el texto en Markdown.
* **No se almacena la imagen/archivo original:** La única fuente de verdad contable y pedagógica es el texto del enunciado (`enunciado String`), el cual el docente puede revisar y corregir antes de guardar.

### 2.3. Unificación de Listado y Métricas de Tablero
* El endpoint `GET /ejercicios` unifica:
  1. La **paginación plana** de los ejercicios (`items`, `page`, `pageSize`, `totalItems`, `totalPages`).
  2. El bloque **`resumen`** con los contadores globales del docente (`total`, `enviados`, `sinResolver`, `resueltos`).
* Reduce la cantidad de llamadas HTTP al acceder a la pantalla "Mis ejercicios".

### 2.4. Semántica HTTP y uso de `PATCH`
* Siguiendo la `GuiaDesarrolloBackend.md`:
  * Para editar un ejercicio se utiliza `PATCH /ejercicios/:id`.
  * Para guardar avances de la resolución modelo o marcarla como completada se utiliza `PATCH /ejercicios/:id/resolucion`, permitiendo actualizaciones parciales de plantillas sin requerir reenviar la totalidad del recurso.

### 2.5. Cero Suposiciones y Funcionalidades Descartadas
* **Sin `DELETE`:** No se implementará eliminación de ejercicios, dado que el documento funcional no contempla esa operación y prioriza las acciones de *Editar*, *Ver detalle* y *Duplicar*.

---

## 3. Catálogo de Endpoints

### 3.1. Asistentes de Redacción (Ya implementados ✅)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/ejercicios/generar/opciones` | Devuelve los catálogos para combos: tipos de ejercicio, dificultades y contenidos adicionales. |
| `POST` | `/ejercicios/digitalizar` | Extrae el enunciado en Markdown a partir de una foto o PDF subido por el docente. |
| `POST` | `/ejercicios/generar` | Genera una vista previa del enunciado con IA a partir de los parámetros seleccionados. |

### 3.2. Endpoints a Desarrollar (Fase Docente 🎯)

| # | Método | Endpoint | Descripción y Reglas |
| :---: | :--- | :--- | :--- |
| **1** | `POST` | `/ejercicios` | **Crear Ejercicio:** Guarda el ejercicio en estado `BORRADOR` o `PUBLICADO`. Asocia curso, plantillas habilitadas (`EjercicioPlantilla`) y metadata opcional de IA (`GeneracionEjercicioIA`). |
| **2** | `GET` | `/ejercicios` | **Listado "Mis ejercicios":** Paginación plana con filtros (`cursoId`, `estado`, búsqueda por `titulo`) y cálculo del estado visual de la card (`Borrador`, `Publicado`, `Sin resolver`, `Resuelto`). Incluye objeto `resumen`. |
| **3** | `GET` | `/ejercicios/:id` | **Detalle del Ejercicio:** Consulta central única. Devuelve información general, plantillas habilitadas, resumen contextual según origen (IA vs Digitalizado), estado de resolución docente y total de alumnos del curso. |
| **4** | `PATCH` | `/ejercicios/:id` | **Editar Ejercicio:** En estado `BORRADOR` permite editar todos los campos. En estado `PUBLICADO` restringe la edición únicamente a `fechaLimite` e `indicaciones`. |
| **5** | `POST` | `/ejercicios/:id/duplicar` | **Duplicar Ejercicio:** Clona el ejercicio existente en un nuevo registro en estado `BORRADOR` con sus plantillas habilitadas. |
| **6** | `GET` | `/ejercicios/:id/resolucion` | **Consultar Resolución Docente:** Obtiene las plantillas resueltas del ejercicio (`ResolucionDocentePlantilla`) con su contenido JSON para visualización o edición. |
| **7** | `PATCH` | `/ejercicios/:id/resolucion` | **Guardar / Finalizar Resolución Modelo:** Permite guardar borradores de avance de las plantillas o marcar la resolución como `COMPLETADA`. |

---

## 4. Metodología de Implementación

Cada endpoint se desarrollará de forma estrictamente incremental respetando:

1. **Un endpoint a la vez.**
2. **Flujo por capas en orden:**
   ```text
   Validator & DTOs  →  Repository  →  Service  →  Controller  →  Routes  →  Swagger Docs
   ```
3. **Paso a paso con confirmación:** No saltar a la siguiente capa sin aprobación previa.
4. **Validaciones de negocio en el Service:**
   * El docente autenticado debe tener asignado el `cursoId` del ejercicio.
   * La `fechaLimite` debe ser futura al momento de publicación.
   * Las reglas de no mutabilidad sobre ejercicios ya publicados.
5. **Repository pasivo:** Uso del patrón `getDbClient(tx)` y encapsulamiento estricto de Prisma.
6. **Formato:** Identificadores numéricos puros (sin prefijos sintéticos).
