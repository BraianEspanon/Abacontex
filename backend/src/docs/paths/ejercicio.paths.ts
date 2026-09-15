/**
 * @openapi
 * /ejercicios/digitalizar:
 *   post:
 *     summary: Digitalizar documento contable mediante IA (OCR)
 *     description: |
 *       Extrae y transcribe el enunciado de un ejercicio contable a partir de una imagen o documento PDF,
 *       devolviendo el texto formateado en Markdown estándar (GFM).
 *
 *       Servicio asistencial sin persistencia en base de datos.
 *       Requiere rol DOCENTE.
 *
 *     tags:
 *       - Ejercicios
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       description: Archivo de imagen (JPG, PNG, WEBP) o documento PDF con el enunciado a digitalizar.
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DigitalizarEjercicioRequest'
 *
 *     responses:
 *       200:
 *         description: Documento digitalizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigitalizarEjercicioResponse'
 *
 *       400:
 *         description: Archivo no provisto, vacío, con formato no permitido, tamaño excedido o error de lectura de IA.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: Requiere rol DOCENTE.
 */
