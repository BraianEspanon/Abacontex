# Guía de Endpoints: Módulo de Simulación Empresarial
## ABACONTEX

> **Objetivo:** Guía ejecutiva y resumida de los endpoints del módulo, alineada 1 a 1 con los títulos de las tareas de Jira: **qué hace cada uno y por qué hace falta**, sin entrar en detalles de esquemas JSON (los cuales se documentarán en Swagger y Postman).

---

### Resumen Rápido (Checklist de Endpoints alineados con Jira)

| # | Tarea en Jira | Método | Endpoint | Rol | Estado |
|---|---|---|---|---|---|
| 1 | **ENDPOINT - GET Opciones para crear** | `GET` | `/simulaciones/opciones-crear` | Docente | **Listo** |
| 2 | **ENDPOINT - GET Simulaciones (Docente)** | `GET` | `/simulaciones` | Docente | **Listo** |
| 3 | **ENDPOINT - POST Simulación** | `POST` | `/simulaciones` | Docente | **Listo** |
| 4 | **ENDPOINT - PATCH Editar titulo simulación** | `PATCH` | `/simulaciones/:id/titulo` | Docente | **Listo** |
| 5 | **ENDPOINT - GET Entregas de simulación** | `GET` | `/simulaciones/:id/entregas` | Docente | **Listo** |
| 6 | **ENDPOINT - GET Simulaciones (Alumno)** | `GET` | `/simulaciones/alumno` | Alumno | **Listo** |
| 7 | **ENDPOINT - GET Conversación** | `GET` | `/simulaciones/conversacion/:id` | **Ambos** | **Listo** |
| 8 | **ENDPOINT - POST Responder** | `POST` | `/simulaciones/conversacion/:id/responder` | Alumno | **Listo** |
| 9 | **ENDPOINT - GET Resumen** | `GET` | `/simulaciones/conversacion/:id/resumen` | **Ambos** | **Listo** |

---

### 1. Configuración y Selectores

#### `GET /simulaciones/opciones-crear`
*(Jira: ENDPOINT - GET Opciones para crear)*
* **Rol:** Docente.
* **¿Qué hace?** Devuelve las opciones para los selectores del formulario de creación: los 9 flujos empresariales, las 3 dificultades, las 3 duraciones y los 8 tipos de eventos sorpresa.
* **¿Por qué hace falta?** 
  * Evita hardcodear strings en el frontend que puedan fallar en la validación estricta de Zod (`z.enum`).
  * Sigue el mismo patrón arquitectónico de `GET /ejercicios/generar/opciones`.
  * Si se modifica o agrega un flujo en el backend, la UI se actualiza sola sin desplegar frontend.

---

### 2. Vista Docente

#### `GET /simulaciones`
*(Jira: ENDPOINT - GET Simulaciones (Docente))*
* **Rol:** Docente.
* **¿Qué hace?** Listado paginado de simulaciones creadas por el docente (`pageSize`: 6 por página), con filtros (`titulo`, `cursoId`, `estado`), avance de empresas que comenzaron y 4 cards de resumen cuantitativo (`total`, `pendientes`, `enCurso`, `finalizadas`).
* **¿Por qué hace falta?** Es el dashboard principal del profesor (Mis Simulaciones) para monitorear el estado global de sus cursos.

#### `POST /simulaciones` *(Ya implementado)*
*(Jira: ENDPOINT - POST Simulación)*
* **Rol:** Docente.
* **¿Qué hace?** Llama a la IA para generar la plantilla base del flujo e instancia los grafos personalizados para cada empresa activa del curso en una única transacción de base de datos.
* **¿Por qué hace falta?** Es la acción central de creación que deja la simulación publicada para los alumnos.

#### `PATCH /simulaciones/:id/titulo`
*(Jira: ENDPOINT - PATCH Editar titulo simulación)*
* **Rol:** Docente.
* **¿Qué hace?** Permite al docente modificar exclusivamente el `titulo` de la simulación.
* **¿Por qué hace falta?** Según el documento de decisiones funcionales, el contenido pedagógico y las decisiones generadas por la IA no pueden ser alteradas para mantener la coherencia del árbol, pero el docente sí tiene la potestad de personalizar el título visible de la actividad.

#### `GET /simulaciones/:id/entregas`
*(Jira: ENDPOINT - GET Entregas de simulación)*
* **Rol:** Docente.
* **¿Qué hace?** Al hacer clic en *"Ver entregas"*, lista todas las empresas asignadas al curso de esa simulación con su estado individual (`PENDIENTE`, `EN_CURSO`, `FINALIZADA`), fechas de inicio/fin y puntaje final obtenido.
* **¿Por qué hace falta?** Permite al docente seguir el progreso de cada equipo y saber quiénes están jugando, quiénes terminaron y quiénes todavía no empezaron.

---

### 3. Vista Alumno

#### `GET /simulaciones/alumno`
*(Jira: ENDPOINT - GET Simulaciones (Alumno))*
* **Rol:** Alumno.
* **¿Qué hace?** Lista las simulaciones asignadas a la empresa del alumno autenticado, con 5 cards métricas (`total`, `pendientes`, `enCurso`, `finalizadas`, `promedioPuntaje`) y el botón según corresponda: *"Comenzar"*, *"Continuar"* o *"Ver resultados"*.
* **¿Por qué hace falta?** Es el dashboard principal del alumno. Muestra únicamente la información pertinente a su empresa.

---

### 4. Núcleo Conversacional (Sala de Juego, Decisiones y Cierre)

> **Nota de parámetro:** En estas rutas, `:id` corresponde al `idSimulacionEmpresa` (la instancia específica de conversación de la empresa).

#### `GET /simulaciones/conversacion/:id`
*(Jira: ENDPOINT - GET Conversación)*
* **Rol:** Alumno (de la empresa) o Docente (del curso).
* **¿Qué hace?** Devuelve la conversación y el estado de la empresa adaptándose automáticamente según **quién consulta** y el **estado de la simulación**:
  1. **Si consulta un Docente (Modo Auditoría):**
     * Retorna en `modo: "LECTURA"` (`puedeDecidir: false`).
     * Muestra todo el recorrido transitado: mensajes recibidos, decisiones tomadas, qué alumno votó (nombre y rol) y los impactos en caja/stock.
  2. **Si consulta un Alumno y la simulación está `PENDIENTE` o `EN_CURSO` (Modo Interactivo):**
     * Retorna en `modo: "INTERACTIVO"`.
     * Muestra los mensajes transitados hasta el evento activo y las variables en vivo (caja, stock disponible).
     * Si el evento activo es una `DECISION`: incluye las opciones y calcula `puedeDecidir: true` **únicamente si el rol del alumno que consulta coincide con los roles habilitados** para esa decisión; de lo contrario, `false` (debe aguardar a su compañero).
  3. **Si consulta un Alumno y la simulación está `FINALIZADA` (Modo Lectura de Archivo):**
     * Retorna en `modo: "LECTURA"` (`puedeDecidir: false`).
     * Muestra la conversación completa de archivo y las opciones que votó su equipo.
* **¿Por qué hace falta?** Unifica en un solo endpoint el chat en vivo, la lectura de una simulación terminada y la auditoría docente, evitando endpoints duplicados y manteniendo un único contrato conversacional.

#### `POST /simulaciones/conversacion/:id/responder`
*(Jira: ENDPOINT - POST Responder)*
* **Rol:** Alumno (con rol habilitado en el evento actual).
* **¿Qué hace?** Registra la respuesta del equipo a la decisión activa: valida que el alumno tenga el rol permitido para decidir, aplica los cambios numéricos en stock y caja, avanza el puntero de la historia al siguiente evento y, si se alcanza el evento final, marca la empresa como `FINALIZADA` y calcula la nota (0-100) y el feedback.
* **¿Por qué hace falta?** Es el motor de progreso del juego; cada respuesta de los alumnos define el rumbo de la empresa y la historia.

#### `GET /simulaciones/conversacion/:id/resumen`
*(Jira: ENDPOINT - GET Resumen)*
* **Rol:** Alumno (de la empresa) o Docente (del curso).
* **Estado:** **Listo**.
* **¿Qué hace?** Devuelve el informe de cierre pedagógico una vez finalizada la simulación: calificación obtenida (0 a 100), desglose cualitativo de decisiones (muy adecuadas, adecuadas, etc.), balance final de recursos y feedback general para el equipo.
* **¿Por qué hace falta?** Alimenta la pantalla de resultados finales tanto para los alumnos como para el docente cuando consulta el detalle de la entrega.
