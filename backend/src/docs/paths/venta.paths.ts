/**
 * @openapi
 * /ventas:
 *   post:
 *     summary: Registrar una venta
 *     description: |
 *       Registra la venta comercial de un pedido en estado LISTO_PARA_ENTREGAR.
 *       Calcula los importes financieros, ajusta intereses por cuotas (si aplica), aplica IVA,
 *       cambia el estado del pedido a COMPLETADO y crea el movimiento financiero correspondiente.
 *
 *     tags:
 *       - Ventas
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrarVentaRequest'
 *
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VentaCreadaResponse'
 *
 *       400:
 *         description: Datos de entrada inválidos o inconsistentes.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: Permisos insuficientes (requiere rol ALUMNO).
 *
 *       404:
 *         description: Pedido o método de pago no encontrado o no pertenece a la empresa.
 *
 *       409:
 *         description: El pedido no se encuentra en estado LISTO_PARA_ENTREGAR o ya fue vendido.
 *
 *   get:
 *     summary: Obtener listado y métricas de ventas (Dashboard)
 *     description: |
 *       Devuelve las métricas de resumen (ventas registradas, total vendido, ventas del mes, promedio por venta)
 *       y la lista de ventas de la empresa con filtros opcionales de búsqueda, método de pago y mes.
 *
 *     tags:
 *       - Ventas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por ID de venta, ID de pedido o nombre de cliente.
 *       - in: query
 *         name: metodoPagoId
 *         schema:
 *           type: integer
 *         description: Filtrar por identificador de método de pago.
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mes del año en curso (1 al 12).
 *
 *     responses:
 *       200:
 *         description: Dashboard y listado de ventas obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardVentasResponse'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: Permisos insuficientes (requiere rol ALUMNO).
 *
 * /ventas/pedidos-listos:
 *   get:
 *     summary: Listar pedidos listos para vender
 *     description: |
 *       Devuelve todos los pedidos de la empresa en estado LISTO_PARA_ENTREGAR con sus productos,
 *       cantidades y precios calculados para facilitar el registro de la venta.
 *
 *     tags:
 *       - Ventas
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Lista de pedidos listos para facturar/vender.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PedidoListoVentaItem'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: Permisos insuficientes (requiere rol ALUMNO).
 *
 * /ventas/{idVenta}:
 *   get:
 *     summary: Obtener detalle completo de una venta
 *     description: |
 *       Devuelve la información detallada de una venta confirmada, incluyendo cliente,
 *       condiciones comerciales, desglose de totales (subtotal, IVA, intereses, total final) e ítems vendidos.
 *
 *     tags:
 *       - Ventas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idVenta
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador de la venta.
 *
 *     responses:
 *       200:
 *         description: Detalle de la venta.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VentaDetalleResponse'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: Permisos insuficientes (requiere rol ALUMNO).
 *
 *       404:
 *         description: Venta no encontrada o no pertenece a la empresa.
 */
