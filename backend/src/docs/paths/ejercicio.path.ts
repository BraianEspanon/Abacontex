/**
 * @openapi
 * /ejercicios:
 *   get:
 *     summary: Obtener listado paginado de ejercicios del docente con métricas del dashboard
 *     description: Retorna la lista paginada de ejercicios pertenecientes al docente autenticado, soportando filtros por curso, búsqueda por título y estado visual (BORRADOR, ENVIADO, SIN_RESOLVER, EN_CORRECCION, COMPLETADO). Incluye además el resumen acumulado de métricas (total, enviados, sinResolver, enCorreccion) y paginación plana sin metadatos anidados.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *         description: Cantidad de ejercicios a retornar por página.
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: integer
 *         description: Filtra los ejercicios asignados al ID del curso especificado.
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Búsqueda de ejercicios cuyo título contenga este texto (insensible a mayúsculas/minúsculas).
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *             - SIN_RESOLVER
 *             - EN_CORRECCION
 *             - COMPLETADO
 *         description: Filtra los ejercicios según su estado visual docente.
 *     responses:
 *       200:
 *         description: Listado paginado y métricas del dashboard obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoEjerciciosResponse'
 *       400:
 *         description: Parámetros de consulta (query) inválidos.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE.
 *       500:
 *         description: Error interno del servidor al obtener los ejercicios.
 *
 *   post:
 *     summary: Crear un nuevo ejercicio contable
 *     description: Permite al docente dar de alta un nuevo ejercicio asignado a uno de sus cursos a cargo. Permite ingresar el enunciado en Markdown (GFM), fecha límite de entrega obligatoria, indicaciones opcionales, plantillas contables requeridas y definir si se guarda en estado preliminar BORRADOR o se publica inmediatamente como ENVIADO.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearEjercicioRequest'
 *     responses:
 *       201:
 *         description: Ejercicio contable creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EjercicioCreadoResponse'
 *       400:
 *         description: Datos de solicitud inválidos o fecha límite menor o igual al momento actual.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE y asignación activa sobre el curso.
 *       404:
 *         description: El curso especificado no existe.
 *       500:
 *         description: Error interno del servidor al crear el ejercicio.
 *
 * /ejercicios/{id}:
 *   get:
 *     summary: Obtener detalle completo de un ejercicio contable
 *     description: Retorna la ficha técnica y pedagógica detallada de un ejercicio perteneciente al docente, incluyendo su estado visual calculado, curso, plantillas requeridas, metadatos de auditoría y progreso global de entregas de los estudiantes.
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
 *         description: ID numérico del ejercicio.
 *     responses:
 *       200:
 *         description: Detalle del ejercicio obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleEjercicioResponse'
 *       400:
 *         description: ID de ejercicio inválido (debe ser un entero positivo).
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El ejercicio no pertenece al docente autenticado.
 *       404:
 *         description: Ejercicio contable no encontrado.
 *       500:
 *         description: Error interno del servidor al consultar el ejercicio.
 *
 *   patch:
 *     summary: Modificar o publicar un ejercicio contable existente
 *     description: Permite actualizar parcialmente las propiedades de un ejercicio del docente. Si el ejercicio está en BORRADOR, permite modificar libremente el curso, plantillas y enunciado, o publicarlo enviando estado ENVIADO. Si el ejercicio ya está publicado, no se permite alterar el curso ni el conjunto de plantillas contables.
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
 *         description: ID numérico del ejercicio a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditarEjercicioRequest'
 *     responses:
 *       200:
 *         description: Ejercicio contable actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleEjercicioResponse'
 *       400:
 *         description: Datos de solicitud inválidos o intento de modificar campos protegidos de un ejercicio ya publicado.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El ejercicio o el nuevo curso no pertenecen al docente autenticado.
 *       404:
 *         description: Ejercicio contable no encontrado.
 *       500:
 *         description: Error interno del servidor al actualizar el ejercicio.
 *
 * /ejercicios/{id}/resolucion:
 *   get:
 *     summary: Obtener la resolución modelo docente de un ejercicio
 *     description: Permite al docente consultar el estado global de su resolución modelo y el contenido estructurado de cada una de las plantillas contables vinculadas al ejercicio (Libro Diario, Libro Mayor, Libro IVA y Hoja de Trabajo).
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
 *         description: ID numérico del ejercicio.
 *     responses:
 *       200:
 *         description: Resolución modelo del docente obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolucionDocenteResponse'
 *       400:
 *         description: ID de ejercicio inválido.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El ejercicio no pertenece al docente autenticado.
 *       404:
 *         description: Ejercicio contable no encontrado.
 *       500:
 *         description: Error interno del servidor al consultar la resolución docente.
 *
 *   patch:
 *     summary: Guardar o actualizar la resolución de una plantilla contable
 *     description: Guarda el contenido resuelto por el docente para una plantilla contable específica. Si se envía con estado EN_EDICION, permite guardado parcial y flexible sin validaciones de balance. Si se envía con estado RESUELTO, se aplican validaciones estrictas de partida doble y consistencia contable según el tipo de plantilla.
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
 *         description: ID numérico del ejercicio cuya plantilla se actualiza.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarResolucionDocenteRequest'
 *     responses:
 *       200:
 *         description: Plantilla contable de la resolución docente actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolucionDocenteResponse'
 *       400:
 *         description: Datos de plantilla inválidos, plantilla no requerida por el ejercicio o error en las validaciones contables al marcar como RESUELTO.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El ejercicio no pertenece al docente autenticado.
 *       404:
 *         description: Ejercicio contable o resolución no encontrados.
 *       500:
 *         description: Error interno del servidor al guardar la resolución docente.
 *
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
 *
 * /ejercicios/generar/opciones:
 *   get:
 *     summary: Obtener catálogo de opciones y parámetros disponibles para la generación de ejercicios
 *     description: Retorna los tipos de ejercicio, dificultades y contenidos adicionales disponibles con sus etiquetas legibles para poblar los controles del frontend.
 *     tags:
 *       - Ejercicios
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Catálogo de opciones obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionesGeneracionResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE.
 */
