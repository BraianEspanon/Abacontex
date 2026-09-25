# Módulo de Ejercicios con IA — Guía de Integración Frontend

Esta guía explica de forma práctica y directa cómo consumir los servicios asistenciales de Inteligencia Artificial para ejercicios contables desde el frontend de Abacontex.

> [!NOTE]
> El módulo de ejercicios incorporará más adelante la persistencia completa (guardar borradores, asignar ejercicios a cursos, fechas límite, plantillas y resoluciones).
> En esta etapa nos enfocamos **exclusivamente en las herramientas de IA ya disponibles**, las cuales son **sin estado (_stateless_)**: reciben datos o archivos y devuelven el enunciado redactado en Markdown listo para previsualizar y editar.

---

# Flujo General en Pantalla ("Nuevo Ejercicio")

La pantalla de creación de ejercicios cuenta con dos métodos de entrada que alimentan una única tarjeta compartida de **Vista previa del ejercicio**:

```text
       Pestaña 1: "Crear con IA"                  Pestaña 2: "Digitalizar con IA"
 (Parámetros: curso, tipo, dificultad)               (Foto o PDF de examen impreso)
                   │                                               │
                   ▼                                               ▼
         POST /ejercicios/generar                      POST /ejercicios/digitalizar
                   │                                               │
                   └───────────────────────┬───────────────────────┘
                                           │
                                           ▼
                       { "enunciadoTexto": "Markdown..." }
                                           │
                                           ▼
                       ┌───────────────────────────────────────┐
                       │      VISTA PREVIA DEL ENUNCIADO       │
                       │   - Renderizado Markdown interactivo  │
                       │   - Modo edición manual (Lápiz ✎)     │
                       └───────────────────────────────────────┘
```

---

# 1. Pestaña: "Crear con IA" (Generación por Parámetros)

En esta modalidad el docente no escribe prompts largos: solo elige opciones en desplegables y el backend se encarga del encuadre pedagógico y contable.

---

## Paso 1.1: Obtener las opciones para el formulario

Al montar la pantalla, el frontend debe consultar las opciones disponibles para armar los selectores:

```http
GET /ejercicios/generar/opciones
Authorization: Bearer <token_keycloak>
```

### Respuesta esperada (HTTP 200 OK):

```json
{
  "tiposEjercicio": [
    {
      "id": "COMPRAS_VENTAS_BASICAS",
      "label": "Compras y ventas básicas",
      "permiteContenidosAdicionales": true
    },
    {
      "id": "OPERACIONES_COMERCIALES_INTEGRADAS",
      "label": "Operaciones comerciales integradas",
      "permiteContenidosAdicionales": false
    },
    {
      "id": "AJUSTES_HOJA_TRABAJO",
      "label": "Ajustes y Hoja de Trabajo",
      "permiteContenidosAdicionales": false
    },
    {
      "id": "COSTOS_PROCESO_PRODUCTIVO",
      "label": "Costos y proceso productivo",
      "permiteContenidosAdicionales": false
    }
  ],
  "dificultades": [
    {
      "id": "BASICO",
      "label": "Básico (~4 operaciones)"
    },
    {
      "id": "INTERMEDIO",
      "label": "Intermedio (~6 operaciones)"
    },
    {
      "id": "AVANZADO",
      "label": "Avanzado (~10 operaciones)"
    }
  ],
  "contenidosAdicionales": [
    {
      "id": "IVA",
      "label": "Incluir IVA (21%)"
    },
    {
      "id": "INTERESES",
      "label": "Incluir intereses de financiación"
    },
    {
      "id": "DESCUENTOS",
      "label": "Incluir descuentos / bonificaciones"
    }
  ]
}
```

### 💡 Comportamiento de UI con `permiteContenidosAdicionales`:

- Cuando el docente selecciona un `tipoEjercicio` cuyo `permiteContenidosAdicionales` sea `true` (ej. **Compras y ventas básicas**), el frontend muestra la sección de checkboxes de contenidos adicionales (_IVA_, _Intereses_, _Descuentos_).
- Si selecciona cualquier otro tipo donde sea `false`, el frontend oculta esa sección y simplemente envía `contenidosAdicionales: []`.

> [!TIP]
> En React con **TanStack Query**, consultá este endpoint con `staleTime: Infinity` para que se descargue una sola vez y no vuelva a pedirlo innecesariamente.

---

## Paso 1.2: El selector de Cursos (`cursoId`)

El selector de cursos se llena con los cursos que tiene asignados el docente (usando los endpoints habituales de cursos del docente, ej. `GET /docentes/me/cursos`).

- El frontend solo necesita enviar el `cursoId: number`.
- **El backend consulta automáticamente el año del curso (5.° o 6.° año)** para aplicar las reglas contables:
  - **5.° Año:** La IA genera una **S.R.L.** (cuotas sociales, compras/ventas, ajustes).
  - **6.° Año:** La IA genera una **S.A.** (acciones, operaciones integradas, costos fabriles).
- El frontend no tiene que hacer ningún mapeo societario a mano.

---

## Paso 1.3: Disparar la generación del enunciado

La generación **no debe dispararse automáticamente** con cada cambio de select. Se ejecuta cuando el docente hace clic en el botón:

- **`[ ✨ Generar enunciado ]`** (primera vez).
- **`[ 🔄 Regenerar enunciado ]`** (si ya tiene un texto en vista previa y quiere otra variante).

```http
POST /ejercicios/generar
Authorization: Bearer <token_keycloak>
Content-Type: application/json
```

### Body de la petición (Payload):

```json
{
  "cursoId": 1,
  "tipoEjercicio": "COMPRAS_VENTAS_BASICAS",
  "dificultad": "INTERMEDIO",
  "contenidosAdicionales": ["IVA", "INTERESES"],
  "contextoAdicional": "Empresa dedicada a la venta de artículos de librería y papelería comercial."
}
```

#### Reglas de los campos:

| Campo                   | Tipo       | Obligatorio | Detalle                                                                                |
| :---------------------- | :--------- | :---------: | :------------------------------------------------------------------------------------- |
| `cursoId`               | `number`   |   **Sí**    | ID del curso (entero positivo). Debe pertenecer al docente autenticado.                |
| `tipoEjercicio`         | `string`   |   **Sí**    | Uno de los IDs obtenidos en el endpoint de opciones.                                   |
| `dificultad`            | `string`   |   **Sí**    | Uno de los IDs obtenidos en el endpoint de opciones.                                   |
| `contenidosAdicionales` | `string[]` |     No      | Array de strings (`IVA`, `INTERESES`, `DESCUENTOS`). Si no aplica, enviar `[]`.        |
| `contextoAdicional`     | `string`   |     No      | Texto libre opcional, **máximo 200 caracteres** (ideal poner un contador en el input). |

---

### Respuesta exitosa (HTTP 200 OK):

```json
{
  "enunciadoTexto": "**Distribuidora del Centro S.R.L.**  \nRubro: venta de artículos de librería y papelería comercial.  \nCondición frente al IVA: Responsable Inscripto.  \n\n1. 02/05 – **Factura Original N.° 001** por compra de 200 cuadernos a $ 350,00 c/u...\n\n### Se pide:\nRegistrar en el Libro Diario general..."
}
```

El valor de `enunciadoTexto` se carga directamente en el estado de la **Vista previa del ejercicio**.

---

### Manejo de errores de `POST /ejercicios/generar`:

- **`400 Bad Request`**: Datos inválidos en el formulario (ej. faltó un campo obligatorio o el contexto superó los 200 caracteres). El backend devuelve el detalle de error en `error.details.errors`.
- **`403 Forbidden`**: El docente no tiene asignado el curso indicado (`"No tienes permisos sobre el curso especificado."`).
- **`404 Not Found`**: El curso no existe en la base de datos.
- **`400 Bad Request` (Saturación de IA)**: Si el proveedor de IA tuviera algún pico de demanda, responderá un mensaje amigable: _"El servicio de generación está experimentando una alta demanda temporal. Por favor, intentá nuevamente en unos segundos."_ Mostrarlo en un toast o alerta.

---

# 2. Pestaña: "Digitalizar con IA" (OCR de Imagen o PDF)

En esta modalidad el docente sube una foto o PDF con un ejercicio que tiene en papel, y la IA lo transcribe a Markdown.

```http
POST /ejercicios/digitalizar
Authorization: Bearer <token_keycloak>
Content-Type: multipart/form-data
```

### Form Data:

- **Key:** `archivo` (tipo `File` / binario).
- **Formatos soportados:** JPG, PNG, WEBP o PDF.
- **Tamaño máximo:** 10 MB.

### Respuesta exitosa (HTTP 200 OK):

```json
{
  "enunciadoTexto": "### Distribuidora Norte S.R.L.\n\n1. 02/05 - **Factura Original N° 0001-00004523**..."
}
```

### Manejo de errores de `POST /ejercicios/digitalizar`:

- **`400 Bad Request`**: No se adjuntó archivo, el archivo supera los 10 MB o la imagen no es legible.

---

# 3. La Tarjeta "Vista Previa del Ejercicio" (UX Frontend)

Tanto la generación como la digitalización convergen en el mismo componente de vista previa:

```text
┌────────────────────────────────────────────────────────┐
│  Vista previa del ejercicio                            │
│                                           [ ✎ Editar ] │
│ ────────────────────────────────────────────────────── │
│                                                        │
│  Distribuidora del Centro S.R.L.                       │
│  Condición frente al IVA: Responsable Inscripto        │
│                                                        │
│  1. 02/05 – Factura Original N.° 001 por compra de...  │
│  2. 05/05 – Factura Duplicado N.° 010 por venta de...  │
│                                                        │
│  Se pide:                                              │
│  - Registrar las operaciones en el Libro Diario        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Estados recomendados para el componente:

1. **Estado Inicial (Vacío):**
   - Mostrar un _empty state_ con un ícono y un texto instructivo: _"Configurá los parámetros y presioná 'Generar enunciado', o subí un archivo para digitalizarlo."_
   - Los botones finales (_Guardar borrador_, _Enviar a alumnos_) permanecen deshabilitados.

2. **Estado de Carga (Loading / Skeleton):**
   - Deshabilitar el botón que disparó la acción y mostrar un spinner.
   - Mostrar un esqueleto animado (_skeleton loader_) en la tarjeta de vista previa mientras la IA genera el texto (suele tardar entre 2 y 5 segundos).

3. **Estado Generado:**
   - Renderizar el texto Markdown devuelto.
   - Habilitar el botón de edición (**Lápiz ✎**).
   - Habilitar los botones de guardado.

---

# 4. Consideraciones Técnicas Clave para Frontend

### A. Renderizado de Markdown y el Signo Pesos (`$`)

- Los enunciados contables argentinos utilizan intensivamente importes en pesos (ej. `$ 45.000,00 c/u`).
- **Recomendación crítica:** Al configurar librerías como `react-markdown`, **NO incluyan extensiones de fórmulas matemáticas (como `remark-math` o `rehype-katex`)**.
  - Si activan extensiones matemáticas, el visor creerá erróneamente que entre dos importes `$ ... $` hay una ecuación y deformará el texto.
  - Usen `react-markdown` estándar con `remark-gfm` (para soportar tablas y negritas). El signo `$` se mostrará perfecto como texto normal.

### B. Modo Edición Manual (Lápiz ✎)

- Cuando el docente presiona el botón del lápiz para retocar el enunciado:
  - Conmutar la vista previa a un `<textarea>` o componente de edición de texto plano enriquecido.
  - Mantener el valor en el estado local de React (`const [enunciado, setEnunciado] = useState(...)`).
  - El docente puede corregir cualquier nombre, fecha o número antes de persistirlo.

---

# 5. Resumen de Endpoints (Cheat Sheet)

| Endpoint                       | Método |     Content-Type      |    Rol    | Uso en el Frontend                                                          |
| :----------------------------- | :----: | :-------------------: | :-------: | :-------------------------------------------------------------------------- |
| `/ejercicios/generar/opciones` | `GET`  |  `application/json`   | `DOCENTE` | Cargar los desplegables de tipos, dificultades y opciones de IVA/intereses. |
| `/ejercicios/generar`          | `POST` |  `application/json`   | `DOCENTE` | Enviar parámetros y obtener el enunciado generado en Markdown.              |
| `/ejercicios/digitalizar`      | `POST` | `multipart/form-data` | `DOCENTE` | Subir foto o PDF para transcribir el enunciado a Markdown con OCR.          |
