/**
 * @openapi
 * components:
 *   schemas:
 *     CrearOrdenProduccionRequest:
 *       type: object
 *       required:
 *         - productoId
 *         - cantidadProducir
 *         - prioridad
 *       properties:
 *         productoId:
 *           type: integer
 *           example: 10
 *         cantidadProducir:
 *           type: integer
 *           example: 25
 *         prioridad:
 *           type: string
 *           enum: [ALTA, MEDIA, BAJA]
 *           example: ALTA
 *         pedidoId:
 *           type: integer
 *           nullable: true
 *           example: 42
 *
 *     OrdenProduccion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         producto:
 *           type: string
 *           example: Cinta adhesiva
 *         cantidad:
 *           type: integer
 *           example: 25
 *         prioridad:
 *           type: string
 *           example: ALTA
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         pedidoId:
 *           type: integer
 *           nullable: true
 *           example: 42
 *
 *     PedidoAsociable:
 *       type: object
 *       properties:
 *         idPedido:
 *           type: integer
 *           example: 42
 *         cliente:
 *           type: string
 *           example: Juan Pérez
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-11T10:30:00.000Z
 *         total:
 *           type: number
 *           format: float
 *           example: 1540.5
 *
 *     OrdenProduccionDetalle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         producto:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 10
 *             nombre:
 *               type: string
 *               example: Cinta adhesiva
 *         cantidad:
 *           type: integer
 *           example: 25
 *         prioridad:
 *           type: string
 *           example: ALTA
 *         estado:
 *           type: string
 *           example: EN_PRODUCCION
 *         pedido:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 42
 *             cliente:
 *               type: string
 *               example: Juan Pérez
 *         historial:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HistorialEstadoOrden'
 *
 *     HistorialEstadoOrden:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-11T10:30:00.000Z
 *
 *     TableroProduccion:
 *       type: object
 *       properties:
 *         resumen:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 6
 *             pendientes:
 *               type: integer
 *               example: 2
 *             enProduccion:
 *               type: integer
 *               example: 3
 *             finalizadas:
 *               type: integer
 *               example: 1
 *         grupos:
 *           type: object
 *           properties:
 *             PENDIENTE:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdenProduccion'
 *             EN_PRODUCCION:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdenProduccion'
 *             FINALIZADA:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdenProduccion'
 */
