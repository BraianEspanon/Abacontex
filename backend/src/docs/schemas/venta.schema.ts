/**
 * @openapi
 * components:
 *   schemas:
 *     RegistrarVentaRequest:
 *       type: object
 *       required:
 *         - pedidoId
 *         - metodoPagoId
 *         - tipoAjuste
 *       properties:
 *         pedidoId:
 *           type: integer
 *           example: 10
 *           description: Identificador del pedido listo para entregar.
 *         metodoPagoId:
 *           type: integer
 *           example: 1
 *           description: Identificador del método de pago.
 *         tipoAjuste:
 *           type: string
 *           enum: [NINGUNO, DESCUENTO, RECARGO]
 *           example: NINGUNO
 *           description: Tipo de ajuste financiero aplicado sobre el subtotal.
 *         porcentajeAjuste:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           example: 10
 *           description: Porcentaje de ajuste (requerido y mayor a 0 si tipoAjuste no es NINGUNO).
 *         aplicaIva:
 *           type: boolean
 *           default: true
 *           example: true
 *           description: Indica si aplica IVA (21%) a la operación.
 *         cantidadCuotas:
 *           type: integer
 *           enum: [1, 3, 6]
 *           default: 1
 *           example: 1
 *           description: Cantidad de cuotas para la venta.
 *
 *     VentaCreadaResponse:
 *       type: object
 *       properties:
 *         idVenta:
 *           type: integer
 *           example: 1
 *         pedidoId:
 *           type: integer
 *           example: 10
 *         totalFinal:
 *           type: number
 *           format: float
 *           example: 217800
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-14T11:00:00.000Z
 *         estado:
 *           type: string
 *           example: CONFIRMADA
 *
 *     PedidoListoVentaDetalle:
 *       type: object
 *       properties:
 *         productoId:
 *           type: integer
 *           example: 3
 *         nombreProducto:
 *           type: string
 *           example: Remera Oversize
 *         cantidad:
 *           type: integer
 *           example: 20
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 9000
 *         precioConsumidorFinal:
 *           type: number
 *           format: float
 *           example: 10890
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 180000
 *
 *     PedidoListoVentaItem:
 *       type: object
 *       properties:
 *         idPedido:
 *           type: integer
 *           example: 10
 *         clienteNombre:
 *           type: string
 *           example: Licha Martinez
 *         clienteMail:
 *           type: string
 *           format: email
 *           example: licha@example.com
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-14T10:00:00.000Z
 *         totalEstimado:
 *           type: number
 *           format: float
 *           example: 180000
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PedidoListoVentaDetalle'
 *
 *     DashboardVentasResumen:
 *       type: object
 *       properties:
 *         ventasRegistradas:
 *           type: integer
 *           example: 45
 *           description: Cantidad total de ventas registradas.
 *         totalVendido:
 *           type: number
 *           format: float
 *           example: 2500000.5
 *           description: Monto total vendido acumulado.
 *         ventasMes:
 *           type: integer
 *           example: 12
 *           description: Cantidad de ventas realizadas en el mes en curso.
 *         promedioVenta:
 *           type: number
 *           format: float
 *           example: 55555.56
 *           description: Monto promedio por venta.
 *
 *     VentaListItem:
 *       type: object
 *       properties:
 *         idVenta:
 *           type: integer
 *           example: 1
 *         pedidoId:
 *           type: integer
 *           example: 10
 *         cliente:
 *           type: string
 *           example: Licha Martinez
 *         metodoPago:
 *           type: string
 *           example: Transferencia
 *         metodoPagoId:
 *           type: integer
 *           example: 1
 *         montoTotal:
 *           type: number
 *           format: float
 *           example: 217800
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-14T11:00:00.000Z
 *         estado:
 *           type: string
 *           example: CONFIRMADA
 *
 *     DashboardVentasResponse:
 *       type: object
 *       properties:
 *         resumen:
 *           $ref: '#/components/schemas/DashboardVentasResumen'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VentaListItem'
 *
 *     DetalleVentaProductoItem:
 *       type: object
 *       properties:
 *         idDetalleVenta:
 *           type: integer
 *           example: 1
 *         productoId:
 *           type: integer
 *           example: 3
 *         nombreProducto:
 *           type: string
 *           example: Remera Oversize
 *         cantidad:
 *           type: integer
 *           example: 20
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 9000
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 180000
 *
 *     VentaDetalleResponse:
 *       type: object
 *       properties:
 *         idVenta:
 *           type: integer
 *           example: 1
 *         pedidoId:
 *           type: integer
 *           example: 10
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-14T11:00:00.000Z
 *         estado:
 *           type: string
 *           example: CONFIRMADA
 *         cliente:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: Licha Martinez
 *             email:
 *               type: string
 *               format: email
 *               example: licha@example.com
 *         condicionesComerciales:
 *           type: object
 *           properties:
 *             formaPago:
 *               type: string
 *               example: Transferencia
 *             tipoAjuste:
 *               type: string
 *               example: NINGUNO
 *             porcentajeAjuste:
 *               type: number
 *               format: float
 *               example: 0
 *             importeAjuste:
 *               type: number
 *               format: float
 *               example: 0
 *             aplicaIva:
 *               type: boolean
 *               example: true
 *             cantidadCuotas:
 *               type: integer
 *               example: 1
 *             porcentajeInteres:
 *               type: number
 *               format: float
 *               example: 0
 *             importeInteres:
 *               type: number
 *               format: float
 *               example: 0
 *         totales:
 *           type: object
 *           properties:
 *             subtotal:
 *               type: number
 *               format: float
 *               example: 180000
 *             importeIva:
 *               type: number
 *               format: float
 *               example: 37800
 *             totalFinal:
 *               type: number
 *               format: float
 *               example: 217800
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetalleVentaProductoItem'
 */
