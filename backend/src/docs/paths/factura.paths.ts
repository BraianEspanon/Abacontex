/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtener el dashboard y listado paginado de facturas
 *     tags: [Facturación]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre de cliente
 *       - in: query
 *         name: tipoFactura
 *         schema:
 *           type: string
 *           enum: [A, B]
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Dashboard de facturas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacturaListResponse'
 * 
 *   post:
 *     summary: Generar nueva factura manualmente
 *     tags: [Facturación]
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerarFacturaRequest'
 *     responses:
 *       201:
 *         description: Factura generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacturaDetalle'
 *       400:
 *         description: Datos inválidos o inconsistentes con la venta (CA04)
 *       409:
 *         description: Conflicto - la venta ya tiene factura
 * 
 * /facturas/ventas-pendientes:
 *   get:
 *     summary: Obtener listado de ventas confirmadas pendientes de facturar
 *     tags: [Facturación]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Listado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VentaPendienteFacturacionResponse'
 * 
 * /facturas/{idFactura}:
 *   get:
 *     summary: Obtener detalle completo de una factura
 *     tags: [Facturación]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: idFactura
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FacturaDetalle'
 *       404:
 *         description: Factura no encontrada
 */
