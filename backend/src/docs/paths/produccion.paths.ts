/**
 * @openapi
 * /produccion:
 *   get:
 *     summary: Obtener tablero de producción
 *     description: |
 *       Devuelve el tablero de órdenes de producción para la empresa asociada al usuario autenticado.
 *       Las órdenes se agrupan por estado.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Tablero de producción.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableroProduccion'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar producción.
 *
 *   post:
 *     summary: Crear una orden de producción
 *     description: |
 *       Crea una nueva orden de producción para un producto de la empresa del usuario autenticado.
 *       Opcionalmente puede asociarse a un pedido existente.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearOrdenProduccionRequest'
 *
 *     responses:
 *       201:
 *         description: Orden de producción creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenProduccion'
 *
 *       400:
 *         description: Datos inválidos o no se puede crear la orden.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para crear órdenes de producción.
 *
 * /produccion/pedidos-asociables:
 *   get:
 *     summary: Obtener pedidos asociables a una orden de producción
 *     description: |
 *       Devuelve la lista de pedidos que pueden asociarse a una orden de producción.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Pedidos disponibles para asociar.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PedidoAsociable'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar pedidos asociables.
 *
 * /produccion/{idOrden}:
 *   get:
 *     summary: Obtener detalle de una orden de producción
 *     description: |
 *       Devuelve el detalle completo de una orden de producción perteneciente a la empresa del usuario autenticado.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idOrden
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la orden de producción.
 *
 *     responses:
 *       200:
 *         description: Detalle de la orden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenProduccionDetalle'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar órdenes de producción.
 *
 *       404:
 *         description: Orden no encontrada.
 *
 * /produccion/{idOrden}/iniciar:
 *   patch:
 *     summary: Iniciar una orden de producción
 *     description: |
 *       Cambia el estado de una orden de producción a En Producción.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idOrden
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la orden de producción.
 *
 *     responses:
 *       200:
 *         description: Orden iniciada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenProduccion'
 *
 *       400:
 *         description: La orden no puede iniciarse.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar órdenes de producción.
 *
 *       404:
 *         description: Orden no encontrada.
 *
 * /produccion/{idOrden}/finalizar:
 *   patch:
 *     summary: Finalizar una orden de producción
 *     description: |
 *       Finaliza una orden de producción que se encuentra en curso.
 *
 *     tags:
 *       - Producción
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idOrden
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la orden de producción.
 *
 *     responses:
 *       200:
 *         description: Orden finalizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenProduccion'
 *
 *       400:
 *         description: La orden no puede finalizarse.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar órdenes de producción.
 *
 *       404:
 *         description: Orden no encontrada.
 */
