/**
 * @openapi
 * /entregas:
 *   get:
 *     summary: Listar ejercicios del alumno (Tablero "Mis ejercicios")
 *     description: |
 *       Devuelve la lista paginada de ejercicios publicados para el curso del alumno autenticado.
 *       Calcula dinámicamente los estados por alumno (PENDIENTE, EN_PROGRESO, ENTREGADO, CORREGIDO, VENCIDO)
 *       e incluye métricas de resumen para las tarjetas de cabecera del tablero.
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
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
 *         description: Búsqueda textual insensible a mayúsculas/minúsculas por título de ejercicio.
 *         example: "Asientos"
 *       - in: query
 *         name: docenteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID del docente creador.
 *         example: "auth0|64b9..."
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum:
 *             - TODAS
 *             - PENDIENTE
 *             - EN_PROGRESO
 *             - ENTREGADO
 *             - CORREGIDO
 *             - VENCIDO
 *           default: TODAS
 *         description: Filtrar por estado dinámico de entrega.
 *         example: "PENDIENTE"
 *     responses:
 *       200:
 *         description: Tablero de entregas obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoEntregasAlumnoResponse'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o alumno sin curso activo asignado.
 *
 * /entregas/filtros:
 *   get:
 *     summary: Consultar opciones de filtros para el tablero de entregas
 *     description: |
 *       Devuelve los docentes vinculados al curso del alumno autenticado y la lista de estados
 *       con sus claves y etiquetas legibles para poblar los selectores del frontend.
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Opciones de filtros obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionesFiltrosEntregaResponse'
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o alumno sin curso activo.
 *
 * /entregas/{ejercicioId}:
 *   get:
 *     summary: Consultar detalle informativo de un ejercicio y estado de entrega
 *     description: |
 *       Provee la información necesaria para renderizar la pantalla informativa del ejercicio
 *       (previa a iniciar la resolución): consigna, indicaciones, estado de entrega, control de bloqueo
 *       y listado de plantillas habilitadas en formato liviano (sin los JSON pesados).
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
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
 *     responses:
 *       200:
 *         description: Detalle del ejercicio obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleEjercicioAlumnoResponse'
 *       400:
 *         description: Parámetro ID inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o el ejercicio pertenece a otro curso.
 *       404:
 *         description: El ejercicio no se encuentra disponible o no existe.
 *
 * /entregas/{ejercicioId}/resolucion:
 *   get:
 *     summary: Cargar espacio de trabajo del alumno (resolución de plantillas)
 *     description: |
 *       Provee toda la información necesaria para el espacio de trabajo del alumno:
 *       cabecera informativa y el listado de todas las plantillas habilitadas en el ejercicio
 *       con su contenido JSON completo persistido. Si el alumno entra por primera vez,
 *       inicializa automáticamente el registro de EntregaEjercicio.
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
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
 *     responses:
 *       200:
 *         description: Espacio de trabajo y resoluciones cargadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResolucionAlumnoResponse'
 *       400:
 *         description: Parámetro ID inválido.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o el ejercicio pertenece a otro curso.
 *       404:
 *         description: El ejercicio no se encuentra disponible o no existe.
 *
 * /entregas/{ejercicioId}/plantilla:
 *   patch:
 *     summary: Guardar borrador o completar una plantilla específica
 *     description: |
 *       Permite al alumno registrar avances parciales o marcar como completada una plantilla individual
 *       (Libro Diario, Libro Mayor, Libro IVA o Hoja de Trabajo).
 *       Aplica el principio pedagógico: valida únicamente consistencia estructural del JSON sin bloquear por errores contables.
 *       Si el ejercicio ya fue entregado formalmente (bloqueado), rechaza la solicitud con 409 Conflict.
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
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
 *     requestBody:
 *       required: true
 *       description: Tipo de plantilla, estado y contenido JSON correspondiente.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuardarPlantillaAlumnoRequest'
 *     responses:
 *       200:
 *         description: Plantilla guardada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuardarPlantillaAlumnoResponse'
 *       400:
 *         description: Estructura del JSON inválida o datos mal formados.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o el ejercicio pertenece a otro curso.
 *       404:
 *         description: Ejercicio no disponible o plantilla no habilitada en este ejercicio.
 *       409:
 *         description: El ejercicio ya fue entregado y no admite modificaciones.
 *
 * /entregas/{ejercicioId}/finalizar:
 *   post:
 *     summary: Entregar ejercicio formalmente (cierre de edición)
 *     description: |
 *       Acción definitiva que ejecuta el alumno para realizar la entrega formal del ejercicio.
 *       Verifica que todas las plantillas habilitadas en el ejercicio se encuentren en estado COMPLETADA.
 *       Registra la marca temporal exacta de entrega, evalúa si fue fuera de término y bloquea permanentemente la edición.
 *       Requiere rol ALUMNO.
 *     tags:
 *       - Entregas
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: ejercicioId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico del ejercicio a entregar.
 *         example: 1
 *     responses:
 *       200:
 *         description: Ejercicio entregado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinalizarEntregaAlumnoResponse'
 *       400:
 *         description: Parámetro ID inválido o falta completar alguna plantilla habilitada.
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: Requiere rol ALUMNO o el ejercicio pertenece a otro curso.
 *       404:
 *         description: El ejercicio no existe o no está publicado.
 *       409:
 *         description: El ejercicio ya fue entregado previamente.
 */

