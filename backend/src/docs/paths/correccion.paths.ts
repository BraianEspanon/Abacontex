/**
 * @openapi
 * /correcciones/ejercicios:
 *   get:
 *     summary: Listar ejercicios para el tablero de correcciones docente
 *     description: |
 *       Devuelve la lista paginada de ejercicios publicados del docente autenticado con métricas
 *       agrupadas por estado de avance de corrección (SIN_ENTREGAS, PENDIENTE, EN_CORRECCION, CORREGIDO)
 *       y tarjetas de resumen superior.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página (paginación plana).
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *         description: Cantidad de ejercicios por página.
 *         example: 6
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Filtrar por coincidencia insensible en el título del ejercicio.
 *         example: "Compras"
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del curso.
 *         example: 1
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum:
 *             - TODAS
 *             - SIN_ENTREGAS
 *             - PENDIENTE
 *             - EN_CORRECCION
 *             - CORREGIDO
 *           default: TODAS
 *         description: Filtrar por estado global de corrección del ejercicio.
 *         example: "EN_CORRECCION"
 *     responses:
 *       200:
 *         description: Tablero de correcciones obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoEjerciciosACorregirResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE.
 *
 * /correcciones/filtros:
 *   get:
 *     summary: Consultar opciones de filtros para el tablero de correcciones
 *     description: |
 *       Devuelve los cursos asignados al docente y los estados posibles de corrección
 *       con etiquetas para poblar los selectores superiores.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Filtros obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionesFiltrosCorreccionResponse'
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE.
 *
 * /correcciones/ejercicios/{ejercicioId}/entregas:
 *   get:
 *     summary: Listar entregas de alumnos de un ejercicio específico
 *     description: |
 *       Devuelve la cabecera informativa del ejercicio y el listado paginado de alumnos
 *       pertenecientes al curso con el estado de su entrega y avance de corrección.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: ejercicioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico del ejercicio.
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o apellido del alumno.
 *         example: "Braian"
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum:
 *             - TODAS
 *             - SIN_ENTREGAR
 *             - PENDIENTE
 *             - EN_CORRECCION
 *             - CORREGIDA
 *           default: TODAS
 *         example: "PENDIENTE"
 *     responses:
 *       200:
 *         description: Listado de entregas del ejercicio obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoEntregasEjercicioResponse'
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o el ejercicio no pertenece al docente.
 *       404:
 *         description: Ejercicio no encontrado.
 *
 * /correcciones/entregas/{entregaId}:
 *   get:
 *     summary: Cargar espacio de trabajo de corrección de una entrega (Workspace)
 *     description: |
 *       Carga la resolución del alumno contra la solución modelo del docente, ejecuta en memoria
 *       el motor determinista de comparación contable (< 20 ms), calcula los KPIs (aciertos, discrepancias,
 *       asientos incompletos), evalúa los permisos de gobierno para sugerencias con IA (>= 3 errores)
 *       y devuelve las celdas observadas junto con el borrador de devolución.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la entrega del alumno.
 *         example: 4
 *     responses:
 *       200:
 *         description: Espacio de trabajo de corrección cargado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspacioTrabajoCorreccionResponse'
 *       400:
 *         description: Parámetro entregaId inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE.
 *       404:
 *         description: Entrega no encontrada o no pertenece al docente.
 *
 * /correcciones/entregas/{entregaId}/plantillas/{plantillaId}:
 *   patch:
 *     summary: Actualizar estado de revisión de una plantilla (PENDIENTE / CORREGIDA)
 *     description: |
 *       Permite al docente marcar una plantilla individual como corregida o reabrirla como pendiente.
 *       Requisito obligatorio: Todas las plantillas deben estar CORREGIDA para poder finalizar y enviar la entrega.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *       - in: path
 *         name: plantillaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la plantilla del ejercicio (ejercicioPlantillaId).
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RevisarPlantillaRequest'
 *     responses:
 *       200:
 *         description: Estado de revisión de la plantilla actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RevisarPlantillaResponse'
 *       400:
 *         description: Parámetros o cuerpo inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o la entrega no le pertenece.
 *       404:
 *         description: Entrega o plantilla no encontrada.
 *
 * /correcciones/entregas/{entregaId}/borrador:
 *   patch:
 *     summary: Guardar borrador de retroalimentación
 *     description: |
 *       Permite guardar avances parciales de la devolución pedagógica (máximo 500 caracteres)
 *       sin cerrar la entrega ni emitir notificaciones al alumno.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuardarBorradorCorreccionRequest'
 *     responses:
 *       200:
 *         description: Borrador guardado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuardarBorradorCorreccionResponse'
 *       400:
 *         description: Longitud superior a 500 caracteres o parámetro inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o la entrega no le pertenece.
 *       404:
 *         description: Entrega no encontrada.
 *
 * /correcciones/entregas/{entregaId}/errores/comentario:
 *   patch:
 *     summary: Guardar o actualizar comentario puntual en celda con error (Modal)
 *     description: |
 *       Persiste una observación específica del docente (máximo 255 caracteres) sobre un error
 *       contable detectado. Si el error aún no tenía ID en base de datos, se crea bajo demanda.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuardarComentarioErrorRequest'
 *     responses:
 *       200:
 *         description: Comentario del error guardado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuardarComentarioErrorResponse'
 *       400:
 *         description: Datos inválidos o comentario excede 255 caracteres.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o la entrega no le pertenece.
 *       404:
 *         description: Entrega no encontrada.
 *
 * /correcciones/entregas/{entregaId}/sugerir-retroalimentacion:
 *   post:
 *     summary: Asistencia con IA: Sugerir retroalimentación pedagógica individual
 *     description: |
 *       Genera una devolución orientativa con IA (Groq / Llama 3.3) formulada en tono docente argentino voseo
 *       con un límite estricto de hasta 500 caracteres.
 *       Regla de gobierno estricta: Solo se habilita si la entrega tiene al menos 3 errores detectados.
 *       Si tiene < 3 errores o el ejercicio carece de resolución modelo, responde 400 Bad Request.
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *     responses:
 *       200:
 *         description: Sugerencia pedagógica generada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SugerirRetroalimentacionIaResponse'
 *       400:
 *         description: La entrega presenta menos de 3 errores o falta la resolución modelo docente.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o la entrega no le pertenece.
 *       404:
 *         description: Entrega no encontrada.
 *       503:
 *         description: Fallo de conexión o cuota con el proveedor de IA.
 *
 * /correcciones/entregas/{entregaId}/finalizar:
 *   post:
 *     summary: Finalizar y enviar corrección definitiva al alumno
 *     description: |
 *       Cierre formal de la corrección de la entrega.
 *       Valida obligatoriamente que todas las plantillas habilitadas estén marcadas como CORREGIDA (409 Conflict si falta alguna).
 *       En una transacción atómica: actualiza la cabecera, registra fechaCorreccion, persiste definitivamente
 *       los errores contables detectados y crea una notificación para el alumno en la base de datos.
 *       Dispara en tiempo real los eventos de WebSockets (ejercicio:corregido y notificacion:nueva).
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: entregaId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 4
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinalizarCorreccionRequest'
 *     responses:
 *       200:
 *         description: Corrección finalizada y notificada al alumno con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinalizarCorreccionResponse'
 *       400:
 *         description: Parámetros o retroalimentación inválida.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o la entrega no le pertenece.
 *       404:
 *         description: Entrega no encontrada.
 *       409:
 *         description: Conflicto de estado. Debe marcar todas las plantillas como corregidas antes de enviar.
 *
 * /correcciones/cursos/{cursoId}/analisis-errores:
 *   get:
 *     summary: Obtener análisis estadístico y patrones de errores del curso
 *     description: |
 *       Calcula en tiempo real métricas analíticas consolidadas de errores para todas las entregas
 *       corregidas del curso seleccionado. Incluye KPIs, errores frecuentes, patrones entre ejercicios,
 *       alumnos más afectados, distribución por plantillas contables y estado del diagnóstico pedagógico con IA
 *       (evaluando si hay cambios de tendencia estadísticamente significativos según la política Zero Trust).
 *       Requiere rol DOCENTE.
 *     tags:
 *       - Correcciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Análisis consolidado de errores del curso calculado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalisisErroresCursoResponse'
 *       400:
 *         description: Parámetro de cursoId inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol DOCENTE o el curso no pertenece al docente autenticado.
 *       404:
 *         description: Curso no encontrado.
 */
