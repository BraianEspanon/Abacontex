/**
 * @openapi
 * components:
 *   schemas:
 *     ConciliacionResumen:
 *       type: object
 *       properties:
 *         saldoEsperado:
 *           type: number
 *           example: 30000
 *         movimientosPeriodo:
 *           type: integer
 *           example: 12
 *         ultimaConciliacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-08-01T12:00:00.000Z
 *
 *     RegistrarConciliacionRequest:
 *       type: object
 *       required:
 *         - saldoEsperado
 *         - saldoContado
 *       properties:
 *         saldoEsperado:
 *           type: number
 *           example: 30000
 *           description: Saldo según el sistema.
 *         saldoContado:
 *           type: number
 *           example: 29500
 *           description: Saldo físico o real contado en caja. No puede ser negativo.
 *         observacion:
 *           type: string
 *           maxLength: 250
 *           example: "No se anotó la compra de bolsas para el packaging"
 *           description: Observación obligatoria si hay diferencia entre saldo esperado y contado.
 *
 *     ConciliacionCreadaResponse:
 *       type: object
 *       properties:
 *         idConciliacion:
 *           type: integer
 *           example: 1
 *         empresaId:
 *           type: integer
 *           example: 3
 *         alumnoId:
 *           type: integer
 *           example: 15
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-27T10:00:00.000Z
 *         saldoEsperado:
 *           type: number
 *           example: 30000
 *         saldoContado:
 *           type: number
 *           example: 29500
 *         diferencia:
 *           type: number
 *           example: -500
 *         observacion:
 *           type: string
 *           nullable: true
 *           example: "No se anotó la compra de bolsas para el packaging"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-08-27T10:00:00.000Z
 *
 *     HistorialConciliacionItem:
 *       type: object
 *       properties:
 *         idConciliacion:
 *           type: integer
 *           example: 1
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: 2026-08-27T10:00:00.000Z
 *         alumno:
 *           type: string
 *           example: "Leo Messi"
 *         saldoEsperado:
 *           type: number
 *           example: 30000
 *         saldoContado:
 *           type: number
 *           example: 29500
 *         diferencia:
 *           type: number
 *           example: -500
 *         observacion:
 *           type: string
 *           nullable: true
 *           example: "No se anotó la compra de bolsas para el packaging"
 *
 *     HistorialConciliacionesResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HistorialConciliacionItem'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 12
 *         totalPages:
 *           type: integer
 *           example: 2
 */
