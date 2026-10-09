/**
 * @openapi
 * /notificaciones:
 *   get:
 *     summary: Listar notificaciones del usuario autenticado
 *     description: |
 *       Devuelve el listado paginado de notificaciones correspondientes al usuario autenticado.
 *       Permite filtrar por estado de lectura: TODAS, NO_LEIDAS o LEIDAS.
 *
 *     tags:
 *       - Notificaciones
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Cantidad de registros por página.
 *
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [TODAS, NO_LEIDAS, LEIDAS]
 *           default: TODAS
 *         description: Filtro según el estado de la notificación.
 *
 *     responses:
 *       200:
 *         description: Listado paginado de notificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoNotificacionesResponse'
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 * /notificaciones/contador:
 *   get:
 *     summary: Obtener cantidad de notificaciones no leídas
 *     description: |
 *       Devuelve la cantidad total de notificaciones no leídas del usuario autenticado.
 *       Útil para el badge del ícono de campana en el frontend.
 *
 *     tags:
 *       - Notificaciones
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Contador obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContadorNotificacionesResponse'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 * /notificaciones/leer-todas:
 *   patch:
 *     summary: Marcar todas las notificaciones como leídas
 *     description: |
 *       Marca en lote todas las notificaciones no leídas del usuario autenticado como leídas.
 *
 *     tags:
 *       - Notificaciones
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Notificaciones actualizadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcarTodasLeidasResponse'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 * /notificaciones/{id}/leida:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     description: |
 *       Marca una notificación específica como leída para el usuario autenticado.
 *       Verifica que la notificación pertenezca al usuario.
 *
 *     tags:
 *       - Notificaciones
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
 *           minimum: 1
 *         description: Identificador numérico de la notificación.
 *
 *     responses:
 *       200:
 *         description: Notificación marcada como leída.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificacionItem'
 *
 *       400:
 *         description: Identificador numérico inválido.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: No tienes permisos para acceder a esta notificación.
 *
 *       404:
 *         description: Notificación no encontrada.
 */

