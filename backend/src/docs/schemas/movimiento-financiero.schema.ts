/**
 * @openapi
 * components:
 *   schemas:
 *     MovimientoFinancieroResumen:
 *       type: object
 *       properties:
 *         totalIngresos:
 *           type: number
 *           example: 150000
 *         totalEgresos:
 *           type: number
 *           example: 30000
 *         flujoNeto:
 *           type: number
 *           example: 120000
 *         mesActual:
 *           type: object
 *           properties:
 *             ingresos:
 *               type: number
 *               example: 50000
 *             egresos:
 *               type: number
 *               example: 10000
 *
 *     MovimientoFinancieroGraficoItem:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           example: "Ago 26"
 *         ingresos:
 *           type: number
 *           example: 15000
 *         egresos:
 *           type: number
 *           example: 2000
 *
 *     MovimientoFinancieroListItem:
 *       type: object
 *       properties:
 *         idMovimiento:
 *           type: integer
 *           example: 13
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-21T02:56:59.459Z
 *         concepto:
 *           type: string
 *           example: "Venta de prueba"
 *         importe:
 *           type: number
 *           example: 1000
 *         categoria:
 *           type: string
 *           example: "VENTA"
 *         tipoMovimiento:
 *           type: string
 *           example: "INGRESO"
 *         idTipoMovimiento:
 *           type: integer
 *           example: 1
 *         metodoPago:
 *           type: string
 *           example: "Efectivo"
 *
 *     MovimientoFinancieroListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MovimientoFinancieroListItem'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 21
 *         totalPages:
 *           type: integer
 *           example: 3
 *
 *     TipoMovimientoItem:
 *       type: object
 *       properties:
 *         idTipoMovimiento:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "INGRESO"
 *
 *     CategoriaFinancieraItem:
 *       type: object
 *       properties:
 *         idCategoria:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Venta de productos"
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: "Ingresos por ventas de productos físicos"
 *
 *     CategoriasAgrupadasResponse:
 *       type: object
 *       additionalProperties:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/CategoriaFinancieraItem'
 *       example:
 *         ingreso:
 *           - idCategoria: 1
 *             nombre: "Ventas"
 *             descripcion: "Ingresos por ventas"
 *         egreso:
 *           - idCategoria: 2
 *             nombre: "Sueldos"
 *             descripcion: "Pago de sueldos"
 *
 *     RegistrarMovimientoRequest:
 *       type: object
 *       required:
 *         - fecha
 *         - idCategoria
 *         - concepto
 *         - importe
 *         - idMetodoPago
 *       properties:
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-27T10:00:00.000Z
 *         idCategoria:
 *           type: integer
 *           example: 1
 *         concepto:
 *           type: string
 *           example: "Pago de servicios"
 *         importe:
 *           type: number
 *           example: 5000.50
 *         idMetodoPago:
 *           type: integer
 *           example: 2
 *         observaciones:
 *           type: string
 *           example: "Factura A #0001-00000012"
 */
