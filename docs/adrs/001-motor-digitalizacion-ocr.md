# 1. Selección del motor para digitalización (OCR) de ejercicios contables

- **Estado:** Aceptado
- **Fecha:** Septiembre 2026
- **Autores / Decisores:** Equipo Abacontex
- **Contexto relacionado:** [roadmap_ocr_modulo_ia.md](../ejercicios/roadmap_ocr_modulo_ia.md), [fase_2_requisitos_contrato_digitalizacion.md](../ejercicios/fase_2_requisitos_contrato_digitalizacion.md), [Decisiones Ejercicios y correcciones.md](../ejercicios/Decisiones%20Ejercicios%20y%20correcciones.md)

---

## 1. Contexto y Problema

Dentro del módulo de ejercicios de Abacontex, el flujo **"Digitalizar ejercicio"** permite al docente subir un archivo (foto tomada con teléfono celular o PDF) de un enunciado contable existente para convertirlo en texto digital editable.

A partir del análisis de muestras reales provistas por docentes ([1.jpeg](../muestras/1.jpeg) y [2.jpeg](../muestras/2.jpeg)), se identificaron condiciones de alta complejidad técnica:

1. **Fotocopias escolares reales:** Textos con perspectiva inclinada, curvatura de página, gradientes de sombra por captura con smartphone sobre escritorios y variaciones de contraste.
2. **Estructuras tabulares críticas:** Balances de comprobación de sumas y saldos de hasta 21 cuentas contables con 6 columnas numéricas y totales que deben balancear matemáticamente al 100% (`$ 1.407.916,00` y `$ 754.703,00`).
3. **Formatos contables argentinos:** Separadores decimales con coma, puntos de mil, signos monetarios `$`, nomenclaturas abreviadas (`F.A.`, `F.B.`, `C.S.`, `RI`) y guiones `-` para cuentas sin saldo.

El sistema requería seleccionar un motor de OCR/extracción que transformara estos insumos heterogéneos en **Markdown estándar (GFM)** limpio para ser renderizado directamente en la caja de _Vista previa del ejercicio_, sin sobrecargar el servidor backend ni agregar dependencias binarias pesadas.

---

## 2. Decisión

Se decide utilizar un **Modelo Multimodal de Visión (Gemini Flash vía Google Gen AI SDK / API REST)** como motor principal de extracción y digitalización de enunciados.

La integración se implementará en el backend bajo una interfaz desacoplada (`IDocumentExtractionProvider`), asegurando que la lógica de aplicación dependa de un contrato abstracto y no del SDK específico del proveedor.

---

## 3. Alternativas Consideradas

### Opción A: OCR Clásico Local (Tesseract OCR / PaddleOCR)

- **Descripción:** Ejecución de un binario nativo de OCR dentro del contenedor Docker del backend.
- **Por qué se descartó:**
  - Fracaso rotundo ante tablas contables con perspectiva de teléfono celular: desalinea columnas, divide números y mezcla filas del Debe/Haber con Deudor/Acreedor.
  - Requiere un pipeline complejo de visión computacional previa (OpenCV para deskewing, binarización adaptativa y detección morfológica de celdas).
  - Alto consumo de CPU y memoria RAM en el servidor ante peticiones concurrentes.

### Opción B: Cloud Document AI Especializado (AWS Textract / Azure Document Intelligence)

- **Descripción:** APIs corporativas dedicadas a OCR de documentos y extracción de tablas.
- **Por qué se descartó:**
  - Costo por página sensiblemente mayor en comparación con modelos multimodales ligeros.
  - Su salida requiere un proceso complejo de reensamblado de bloques (_blocks/cells/spans_) para reconstruir el texto narrativo junto con las tablas en Markdown.
  - Menor comprensión del contexto semántico escolar y las abreviaturas contables locales.

### Opción C: Modelos Multimodales de Visión (Gemini Flash) — **Elegida**

- **Descripción:** Procesamiento directo de la imagen/PDF mediante llamada multimodal con prompt de extracción estructurado a Markdown.
- **Fundamentos de elección:**
  - **Fidelidad numérica comprobada:** En la prueba de concepto (Fase 3), alcanzó un 100% de coincidencia en los totales balanceados de la tabla de 21 filas de la Muestra 2.
  - **Generación directa de Markdown:** Reconstruye tablas GFM alineadas y respeta listas jerárquicas en una única llamada, sin necesidad de parsing intermedio de celdas.
  - **Tolerancia a imperfecciones:** Corrige mentalmente la perspectiva, sombras y tipografía degradada sin necesidad de librerías de preprocesamiento gráfico en el backend.
  - **Costo y latencia óptimos:** Costos de centavos por miles de páginas y tiempos de respuesta de entre 2 y 4 segundos, perfectamente compatibles con la experiencia de usuario.

---

## 4. Consecuencias

### Positivas

- **Simplicidad arquitectónica:** El backend se limita a recibir el archivo con Multer en memoria y enviarlo al proveedor, recibiendo directamente el texto formateado en Markdown.
- **Cero sobrecarga de infraestructura local:** No requiere instalar librerías C++ ni dependencias gráficas pesadas dentro de la imagen de Docker del backend.
- **Contrato limpio:** Permite que el endpoint `POST /ejercicios/digitalizar` devuelva únicamente `{ enunciadoTexto: string }`, sin metadatos innecesarios ni lógica sobrante.

### Negativas / Mitigaciones

- **Dependencia de servicio externo:** Requiere conectividad a Internet saliente y una clave de API configurada (`GEMINI_API_KEY`).
  - _Mitigación:_ Se encapsula la llamada detrás de una interfaz (`IDocumentExtractionProvider`) y se configuran timeouts estrictos y manejo expresivo con `BadRequestError` ante fallas o falta de legibilidad.
- **Privacidad de datos:** Los documentos subidos por los docentes viajan a la API de inferencia.
  - _Mitigación:_ Se trata exclusivamente de enunciados didácticos y consignas escolares públicas, sin contener datos personales sensibles ni información financiera real.
