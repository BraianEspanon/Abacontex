/**
 * @openapi
 * /ejercicios/digitalizar:
 *   post:
 *     summary: Digitalizar enunciado de ejercicio contable desde imagen o PDF mediante OCR (IA multimodal)
 *     description: Permite a un docente subir un archivo de imagen (JPG, PNG, WEBP) o documento PDF con un ejercicio contable manuscrito o impreso para transcribirlo estructuradamente a Markdown (GFM).
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DigitalizarEjercicioRequest'
 *     responses:
 *       200:
 *         description: Digitalización exitosa del enunciado en formato Markdown.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigitalizarEjercicioResponse'
 *       400:
 *         description: Archivo no adjunto, archivo vacío o no legible, o saturación temporal del servicio de IA.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE.
 *       500:
 *         description: Error interno del servidor al procesar la digitalización.
 *
 * /ejercicios/generar:
 *   post:
 *     summary: Generar enunciado contable con IA según parámetros pedagógicos y nivel del curso
 *     description: Servicio asistencial sin estado (stateless) para docentes. Genera un enunciado didáctico completo en Markdown (GFM) respetando la normativa societaria (5.° Año S.R.L. vs 6.° Año S.A.), partida doble y documentos comerciales argentinos.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerarEjercicioRequest'
 *     responses:
 *       200:
 *         description: Enunciado contable generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerarEjercicioResponse'
 *       400:
 *         description: Datos de solicitud inválidos (fallo en validación Zod) o error en el servicio de generación de IA.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE y asignación activa sobre el curso especificado.
 *       404:
 *         description: Curso no encontrado en base de datos.
 *       500:
 *         description: Error interno del servidor al procesar la solicitud.
 */
