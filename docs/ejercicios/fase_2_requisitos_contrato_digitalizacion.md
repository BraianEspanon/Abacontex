# Fase 2: Requisitos y Contrato de Datos — Módulo de Digitalización (OCR)

Este documento consolida los acuerdos funcionales y técnicos de la **Fase 2** del módulo de digitalización de ejercicios contables para Abacontex, en base a [Decisiones Ejercicios y correcciones.md](./Decisiones%20Ejercicios%20y%20correcciones.md), [GuiaDesarrolloBackend.md](../GuiaDesarrolloBackend.md), [prompt-ia.md](../prompt-ia.md), el análisis de las muestras reales docentes ([1.jpeg](../muestras/1.jpeg) y [2.jpeg](../muestras/2.jpeg)) y el prototipo visual de la interfaz de usuario.

---

## 1. Contexto de las Muestras Reales y Casos de Uso

A partir de las imágenes de fotocopias reales aportadas en `docs/muestras/`, se definieron los dos escenarios de referencia que el sistema debe soportar con máxima precisión:

1. **Muestra 1 (`1.jpeg`) — Ejercicio de Costos y Proceso Productivo (6.º Año S.A.):**
   - Estructura mixta: texto narrativo con cláusulas de constitución y aportes, tabla de materias primas por día/mes (con celdas vacías a resolver), párrafos de liquidación de haberes y gastos indirectos de fabricación (GIF), y listado cronológico de ventas con comprobantes (_Duplicado Factura A y B_).
   - **Desafío clave:** Preservar la jerarquía de listas (a, b, c...; 1-, 2-...; 1), 2)...) y la tabla intermedia sin perder los porcentajes ni los importes.

2. **Muestra 2 (`2.jpeg`) — Ejercicio de Ajustes y Hoja de Trabajo (5.º Año):**
   - Estructura tabular densa: balance de comprobación de sumas y saldos con 21 cuentas, 6 columnas numéricas y fila de totales balanceada (`$ 1.407.916,00` y `$ 754.703,00`), seguido por consignas de ajuste al pie (_Arqueo de Caja, Deudores en juicio, Amortizaciones_).
   - **Desafío clave:** Extraer la tabla en formato Markdown con alineación estricta de filas y columnas, respetando guiones `-` para celdas sin movimiento y cifras con separadores decimales argentinos.

---

## 2. Requisitos de Entrada (Input Pipeline)

- **Ruta del endpoint:** `POST /ejercicios/digitalizar`
- **Content-Type:** `multipart/form-data`
- **Campo del archivo:** `archivo`
- **Formatos MIME soportados:**
  - Imágenes: `image/jpeg`, `image/png`, `image/webp`
  - Documentos: `application/pdf`
- **Límites de carga:**
  - Tamaño máximo: `10 MB`
  - Páginas máximas por documento (PDF): `5 páginas`
- **Autenticación y Autorización:**
  - Requiere token Keycloak válido (`authenticate`).
  - Rol requerido: `DOCENTE` (`requireRole(ROLES.DOCENTE)`).
- **Body:** No requiere parámetros en el body (servicio puramente asistencial y sin estado). El ejercicio se asocia al curso posteriormente en el endpoint de guardado (`POST /ejercicios`).

---

## 3. Especificación del Formato Markdown de Salida

El texto extraído debe normalizarse a Markdown con formato GitHub Flavored Markdown (GFM):

1. **Estructura de Encabezados:**
   - Título institucional o del caso: `### Instituto Privado General San Martín`
   - Subencabezados de metadatos o contexto: `**Curso:** 5° "III" | **Materia:** Sistema de Información Contable`
2. **Tablas Contables:**
   - Utilizar sintaxis estándar con pipes (`|`) y alineación numérica hacia la derecha para importes:
     ```markdown
     | N°  | Cuentas                   |         Sumas Debe |        Sumas Haber |    Saldos Deudor |  Saldos Acreedor |
     | :-: | :------------------------ | -----------------: | -----------------: | ---------------: | ---------------: |
     |  1  | Socio Caprese Cta. aporte |       $ 200.000,00 |       $ 200.000,00 |                - |                - |
     | ... | ...                       |                ... |                ... |              ... |              ... |
     |     | **TOTALES**               | **$ 1.407.916,00** | **$ 1.407.916,00** | **$ 754.703,00** | **$ 754.703,00** |
     ```
3. **Cifras y Moneda:**
   - Conservar símbolo `$`.
   - Formato de numeración: punto `.` para miles y coma `,` para decimales (`$ 150.000,00`).
   - Conservar guiones `-` para cuentas que no presenten saldo en una columna específica.
4. **Comprobantes y Operaciones:**
   - Fechas y comprobantes destacados en negrita para facilitar su lectura: `**15/09 - Duplicado de Factura A:** ...`

### 3.1. Consideración Técnica Crítica para el Frontend (Renderizado Markdown vs KaTeX)

> [!WARNING] Regla de Implementación en Frontend: Prohibido utilizar plugins de fórmulas matemáticas (KaTeX / MathJax / remark-math).

- **Recomendación para el cliente:** Para renderizar `enunciadoTexto` en la tarjeta de *Vista previa* de React, utilizar exclusivamente componentes estándar con soporte para tablas GFM (como `react-markdown` junto con `remark-gfm`).
- **Justificación técnica y contable:**
  - En el dominio contable, el símbolo `$` se utiliza con alta frecuencia para expresar cifras e importes monetarios en un mismo párrafo o renglón (ej: `"...aporta $ 200.000 en maquinarias y $ 300.000 en efectivo"`).
  - Si el equipo de frontend incorpora extensiones de fórmulas matemáticas (como `remark-math` o `rehype-katex`), el parser interpretará erróneamente cualquier par de signos `$ ... $` como si fuera una ecuación matemática de LaTeX.
  - Como consecuencia directa, el texto intermedio sufriría una grave distorsión visual: se eliminan los espacios entre palabras y se aplica una tipografía cursiva apretada, destruyendo la legibilidad del enunciado contable.
  - Al mantener el renderizador de Markdown puro (sin plugins matemáticos), el símbolo `$` es tratado de forma natural como un caracter de texto plano ordinario en el navegador.

---

## 4. Contrato de Datos Formal (DTOs y Esquemas Zod)

Siguiendo la convención del proyecto en `docs/GuiaDesarrolloBackend.md`, los tipos TypeScript se infieren directamente desde los validadores Zod.

Al tratarse de una subida exclusiva de archivo en memoria (`multipart/form-data`), no se requiere esquema de validación de body en la ruta. El archivo binario es interceptado y validado directamente por Multer (`req.file`) en tamaño y formato MIME.

### 4.1. Esquema de Respuesta (Response DTO)

La respuesta es concisa, enfocada y sin sobreingeniería de metadatos no requeridos por la interfaz:

```typescript
export const digitalizarEjercicioResponseSchema = z.object({
  /** Texto completo del enunciado estructurado en Markdown */
  enunciadoTexto: z
    .string()
    .min(1, "El texto digitalizado no puede estar vacío."),
});

export type DigitalizarEjercicioResponseDTO = z.infer<
  typeof digitalizarEjercicioResponseSchema
>;
```

---

## 5. Alineación con el Prototipo de la Interfaz y Flujo de Usuario

El diseño del endpoint responde exactamente al flujo presentado en la pantalla **"Nuevo ejercicio - Digitalizar ejercicio"**:

```text
[ Subir Archivo ] ──────> POST /ejercicios/digitalizar ──────> { enunciadoTexto }
                                                                      │
                                                                      ▼
                                                       [ Vista previa del ejercicio ]
                                                       (Editable con ícono de lápiz)
                                                                      │
                                                                      ▼
[ Guardar / Enviar ] ────> POST /ejercicios <─────────────────────────┘
```

1. **Momento 1 — Digitalización (Asistencial):**
   - El docente suelta la imagen o PDF en el dropzone (límite 10 MB, formatos JPG/PNG/PDF).
   - El frontend llama a `POST /ejercicios/digitalizar`.
   - El backend devuelve `{ enunciadoTexto }`.
   - El frontend renderiza el contenido directamente dentro de la tarjeta **"Vista previa del ejercicio"**.
   - El docente puede presionar el ícono de **lápiz ($\✎$)** para corregir en el momento cualquier detalle o error tipográfico.

2. **Momento 2 — Configuración y Persistencia:**
   - El docente completa los datos del ejercicio: título, curso, fecha límite e indicaciones opcionales.
   - Selecciona manualmente las plantillas a habilitar en los checkboxes (`Libro diario`, `Libro mayor`, `IVA`, `Hoja de trabajo`).
   - Selecciona el modo de resolución docente (`Resolver ahora` o `Resolver más tarde`).
   - Al hacer click en **"Guardar borrador"** o **"Enviar a los alumnos"**, el frontend invoca a `POST /ejercicios` con la entidad completa para persistirla en la base de datos.

---

## 6. Reglas de Negocio y Manejo de Errores

Siguiendo `docs/GuiaDesarrolloBackend.md` y `docs/prompt-ia.md`:

1. **Uso de Clases de Error de Dominio:**
   - Archivo no enviado o con formato inválido: `BadRequestError('Debe proporcionar un archivo de imagen o PDF válido.')`.
   - Archivo sin texto reconocible o totalmente borroso: `BadRequestError('No se pudo extraer texto legible del archivo. Verifique la nitidez y vuelva a intentarlo.')`.
   - Tamaño superior al límite: `BadRequestError('El archivo supera el tamaño máximo permitido de 10 MB.')`.
   - Fallo de conexión o timeout con el motor de IA: `BadRequestError('El servicio de procesamiento no se encuentra disponible temporalmente.')` (con log interno detallado sin exponer stacktrace al cliente).

2. **Soberanía Docente y Alcance del OCR:**
   - La IA no sugiere ni preselecciona plantillas; las plantillas son administradas exclusivamente por el docente en la UI.
   - La única responsabilidad del motor OCR es la transcripción fiel de caracteres, tablas y formato a Markdown.

---

## 7. Criterios de Aceptación para la Fase 3 (PoC Técnica)

Para considerar exitosa la prueba de concepto con las muestras reales (`1.jpeg` y `2.jpeg`), el motor evaluado debe cumplir:

- [ ] **Fidelidad Numérica:** Coincidencia exacta del 100% en los importes de los totales balanceados de la Muestra 2 (`$ 1.407.916,00` y `$ 754.703,00`).
- [ ] **Integridad Tabular:** Generación de una tabla Markdown válida donde ninguna cuenta quede desplazada respecto a su saldo correspondiente.
- [ ] **Preservación de Jerarquía:** Separación limpia entre el encabezado de la empresa, las operaciones/cuentas y las actividades de ajuste al pie (_"Se pide"_).
- [ ] **Salida Limpia:** El modelo devuelve únicamente el texto del enunciado sin introducciones conversacionales, disclaimers ni metadatos espurios.
- [ ] **Latencia y Recursos:** Tiempo de respuesta aceptable para un flujo interactivo docente (idealmente menor a 8 segundos).
