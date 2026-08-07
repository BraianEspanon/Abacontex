/**
 * @openapi
 * /pedidos:
 *   post:
 *     summary: Crear un pedido
 *     description: |
 *       Crea un nuevo pedido para la empresa asociada al alumno autenticado.
 *       El pedido puede incluir múltiples productos, siempre que no se repita el mismo producto.
 *
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoCrearRequest'
 *
 *     responses:
 *       201:
 *         description: Pedido creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoCreado'
 *
 *       400:
 *         description: Datos inválidos o no hay stock suficiente para algunos productos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para crear pedidos.
 *
 *   get:
 *     summary: Obtener el kanban de pedidos
 *     description: |
 *       Devuelve la vista en kanban de los pedidos de la empresa asociada al usuario autenticado.
 *       Los pedidos se agrupan por estado.
 *
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Kanban de pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KanbanPedidos'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar pedidos.
 *
 * /pedidos/{idPedido}:
 *   get:
 *     summary: Obtener detalle de un pedido
 *     description: |
 *       Devuelve el detalle completo de un pedido perteneciente a la empresa del usuario autenticado.
 *
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del pedido.
 *
 *     responses:
 *       200:
 *         description: Detalle del pedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoDetalle'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar pedidos.
 *
 *       404:
 *         description: Pedido no encontrado.
 *
 * /pedidos/{idPedido}/listo-para-entregar:
 *   patch:
 *     summary: Marcar un pedido como listo para entregar
 *     description: |
 *       Cambia el estado de un pedido pendiente a listo para entregar si no tiene productos pendientes de producción.
 *
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del pedido.
 *
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoCambioEstado'
 *
 *       400:
 *         description: El pedido no puede pasar a ese estado o tiene productos pendientes.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar pedidos.
 *
 *       404:
 *         description: Pedido no encontrado.
 *
 * /pedidos/{idPedido}/completar:
 *   patch:
 *     summary: Completar un pedido
 *     description: |
 *       Cambia el estado de un pedido listo para entregar a completado.
 *
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del pedido.
 *
 *     responses:
 *       200:
 *         description: Pedido completado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoCambioEstado'
 *
 *       400:
 *         description: El pedido no está listo para entregar.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar pedidos.
 *
 *       404:
 *         description: Pedido no encontrado.
 */
