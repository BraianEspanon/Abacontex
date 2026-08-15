/**
 * @openapi
 * /planificacion:
 *   get:
 *     summary: Obtener planificación anual
 *     description: |
 *       Devuelve la planificación anual asociada a la empresa del usuario autenticado.
 *       Incluye un detalle mensual con metas estimadas y producción acumulada.
 *
 *     tags:
 *       - Planificación
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Planificación anual encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanificacionAnual'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar planificación.
 *
 *   post:
 *     summary: Crear una planificación anual
 *     description: |
 *       Crea una nueva planificación anual para la empresa asociada al usuario autenticado.
 *       Debe incluir al menos un detalle mensual.
 *
 *     tags:
 *       - Planificación
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearPlanificacionRequest'
 *
 *     responses:
 *       201:
 *         description: Planificación creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanificacionAnual'
 *
 *       400:
 *         description: Datos inválidos o la planificación ya existe.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para crear planificación.
 *
 * /planificacion/{id}:
 *   patch:
 *     summary: Actualizar una meta mensual de la planificación
 *     description: |
 *       Actualiza las unidades estimadas de un detalle mensual de la planificación anual.
 *
 *     tags:
 *       - Planificación
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del detalle de planificación.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarPlanificacionMensualRequest'
 *
 *     responses:
 *       200:
 *         description: Detalle de planificación actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanificacionAnual'
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar planificación.
 *
 *       404:
 *         description: Detalle de planificación no encontrado.
 */
