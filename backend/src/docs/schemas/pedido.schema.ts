/**
 * @openapi
 * components:
 *   schemas:
 *     PedidoCrearRequest:
 *       type: object
 *       required:
 *         - clienteNombre
 *         - clienteMail
 *         - productos
 *       properties:
 *         clienteNombre:
 *           type: string
 *           maxLength: 100
 *           example: Juan Pérez
 *         clienteMail:
 *           type: string
 *           format: email
 *           example: juan.perez@example.com
 *         productos:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/DetallePedidoRequest'
 *
 *     DetallePedidoRequest:
 *       type: object
 *       required:
 *         - productoId
 *         - cantidad
 *       properties:
 *         productoId:
 *           type: integer
 *           example: 10
 *         cantidad:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           example: 3
 *
 *     PedidoCreado:
 *       type: object
 *       properties:
 *         numeroPedido:
 *           type: integer
 *           example: 42
 *         cliente:
 *           type: string
 *           example: Juan Pérez
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-07T10:30:00.000Z
 *         cantidadProductos:
 *           type: integer
 *           example: 2
 *         totalEstimado:
 *           type: number
 *           format: float
 *           example: 1540.5
 *         tieneFaltantesStock:
 *           type: boolean
 *           example: true
 *         faltantesStock:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FaltanteStock'
 *
 *     FaltanteStock:
 *       type: object
 *       properties:
 *         producto:
 *           type: string
 *           example: Cinta adhesiva
 *         solicitado:
 *           type: integer
 *           example: 10
 *         cubierto:
 *           type: integer
 *           example: 4
 *         faltante:
 *           type: integer
 *           example: 6
 *
 *     PedidoDetalle:
 *       type: object
 *       properties:
 *         numeroPedido:
 *           type: integer
 *           example: 42
 *         cliente:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: Juan Pérez
 *             mail:
 *               type: string
 *               nullable: true
 *               example: juan.perez@example.com
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-07T10:30:00.000Z
 *         creadoPor:
 *           type: string
 *           example: María Gómez
 *         total:
 *           type: number
 *           format: float
 *           example: 1540.5
 *         tieneFaltantesStock:
 *           type: boolean
 *           example: true
 *         faltantesStock:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FaltanteStock'
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetallePedido'
 *
 *     DetallePedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         nombre:
 *           type: string
 *           example: Cinta adhesiva
 *         descripcion:
 *           type: string
 *           example: Cinta adhesiva para embalaje industrial.
 *         fotoUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         cantidad:
 *           type: integer
 *           example: 3
 *         cantidadConStock:
 *           type: integer
 *           example: 2
 *         cantidadPendiente:
 *           type: integer
 *           example: 1
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 120.5
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 361.5
 *
 *     KanbanPedidos:
 *       type: object
 *       properties:
 *         resumen:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 8
 *             pendientes:
 *               type: integer
 *               example: 3
 *             enProduccion:
 *               type: integer
 *               example: 2
 *             listosParaEntregar:
 *               type: integer
 *               example: 3
 *         kanban:
 *           type: object
 *           properties:
 *             PENDIENTE:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarjetaPedido'
 *             EN_PRODUCCION:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarjetaPedido'
 *             LISTO_PARA_ENTREGAR:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarjetaPedido'
 *             COMPLETADO:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarjetaPedido'
 *
 *     TarjetaPedido:
 *       type: object
 *       properties:
 *         numeroPedido:
 *           type: integer
 *           example: 42
 *         cliente:
 *           type: string
 *           example: Juan Pérez
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-07T10:30:00.000Z
 *         cantidadProductos:
 *           type: integer
 *           example: 2
 *         total:
 *           type: number
 *           format: float
 *           example: 1540.5
 *         tieneFaltantesStock:
 *           type: boolean
 *           example: true
 *
 *     PedidoCambioEstado:
 *       type: object
 *       properties:
 *         numeroPedido:
 *           type: integer
 *           example: 42
 *         estado:
 *           type: string
 *           example: LISTO_PARA_ENTREGAR
 *         mensaje:
 *           type: string
 *           example: Pedido marcado como listo para entregar.
 */
