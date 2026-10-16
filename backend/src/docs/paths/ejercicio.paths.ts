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
 *
 * /ejercicios/{id}/resolucion:
 *   get:
 *     summary: Consultar resolución docente del ejercicio
 *     description: |
 *       Devuelve la solución modelo cargada por el docente para el ejercicio indicado,
 *       incluyendo el estado y contenido estructurado de cada plantilla habilitada
 *       (Libro Diario, Libro Mayor, Libro IVA o Hoja de Trabajo).
 *       Requiere rol DOCENTE con asignación al curso correspondiente.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico del ejercicio.
 *         example: 1
 *     responses:
 *       200:
 *         description: Resolución docente obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolucionDocenteResponse'
 *       400:
 *         description: Parámetro ID inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: El docente no tiene permisos sobre el curso al que pertenece este ejercicio.
 *       404:
 *         description: Ejercicio no encontrado.
 *
 *   patch:
 *     summary: Guardar o actualizar resolución docente de una plantilla
 *     description: |
 *       Permite al docente guardar el borrador (`EN_EDICION`) o marcar como finalizada (`RESUELTO`)
 *       una plantilla contable del ejercicio:
 *       - **LIBRO_DIARIO**: Asientos contables balanceados (Debe = Haber).
 *       - **LIBRO_MAYOR**: Mayorización en formato T (cuentas con columnas independientes de Debe y Haber, contracuentas del catálogo y selección de tipo de saldo DEUDOR/ACREEDOR/SALDADA).
 *       - **LIBRO_IVA**: Comprobantes de compras y ventas con determinación de resultado IVA.
 *       - **HOJA_TRABAJO**: Balance de comprobación y columnas patrimoniales/resultados.
 *
 *       Al marcar la plantilla como `RESUELTO`, se ejecutan las validaciones contables de partida doble.
 *       Si todas las plantillas habilitadas alcanzan el estado `RESUELTO`, la resolución global se marca como `RESUELTO`.
 *       Requiere rol DOCENTE con asignación al curso correspondiente.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico del ejercicio.
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: Tipo de plantilla, estado y contenido estructurado correspondiente.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarResolucionDocenteRequest'
 *     responses:
 *       200:
 *         description: Resolución docente actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolucionDocenteResponse'
 *       400:
 *         description: Error de validación estructural o contable (cuentas repetidas, montos inválidos, movimiento sin contracuenta, plantilla no habilitada, etc.).
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: El docente no tiene permisos sobre el curso al que pertenece este ejercicio.
 *       404:
 *         description: Ejercicio no encontrado.
 */
