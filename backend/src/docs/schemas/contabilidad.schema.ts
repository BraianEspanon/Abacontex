/**
 * @openapi
 * components:
 *   schemas:
 *     CuentaLibroMayorItem:
 *       type: object
 *       properties:
 *         cuentaId:
 *           type: integer
 *           example: 1
 *         codigo:
 *           type: string
 *           example: "1.1.1.1"
 *         nombre:
 *           type: string
 *           example: "Fondo Fijo"
 *         tipoCuenta:
 *           type: string
 *           example: "ACTIVO"
 *         numeroFolio:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         totalDebito:
 *           type: number
 *           example: 50000.00
 *         totalCredito:
 *           type: number
 *           example: 1990.00
 *         saldo:
 *           type: number
 *           example: 48010.00
 *         tipoSaldo:
 *           type: string
 *           enum: [DEUDOR, ACREEDOR, SALDADA]
 *           example: "DEUDOR"
 *         esSaldoCorrecto:
 *           type: boolean
 *           example: true
 *         mensajeError:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     CuentaReporteItem:
 *       type: object
 *       properties:
 *         cuentaId:
 *           type: integer
 *           example: 2
 *         codigo:
 *           type: string
 *           example: "1.1.1.2"
 *         nombre:
 *           type: string
 *           example: "Caja"
 *         saldo:
 *           type: number
 *           example: 48010.00
 *
 *     EstadoResultadosResponse:
 *       type: object
 *       properties:
 *         ingresos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaReporteItem'
 *         egresos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaReporteItem'
 *         totalIngresos:
 *           type: number
 *           example: 150000.00
 *         totalEgresos:
 *           type: number
 *           example: 30000.00
 *         resultadoEjercicio:
 *           type: number
 *           example: 120000.00
 *         tipoResultado:
 *           type: string
 *           enum: [GANANCIA, PERDIDA, NEUTRO]
 *           example: "GANANCIA"
 *
 *     BalanceGeneralResponse:
 *       type: object
 *       properties:
 *         activos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaReporteItem'
 *         pasivos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaReporteItem'
 *         patrimonioNeto:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaReporteItem'
 *         resultadoEjercicio:
 *           type: number
 *           example: 120000.00
 *         tipoResultadoEjercicio:
 *           type: string
 *           enum: [GANANCIA, PERDIDA, NEUTRO]
 *           example: "GANANCIA"
 *         totalActivo:
 *           type: number
 *           example: 200000.00
 *         totalPasivo:
 *           type: number
 *           example: 50000.00
 *         totalPatrimonioNeto:
 *           type: number
 *           example: 150000.00
 *         totalPasivoMasPatrimonioNeto:
 *           type: number
 *           example: 200000.00
 *         esBalanceEquilibrado:
 *           type: boolean
 *           example: true
 *         mensajeError:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     RenglonAsientoDetalle:
 *       type: object
 *       properties:
 *         idDetalle:
 *           type: integer
 *           example: 1
 *         orden:
 *           type: integer
 *           example: 1
 *         cuentaId:
 *           type: integer
 *           example: 2
 *         codigoCuenta:
 *           type: string
 *           example: "1.1.1.2"
 *         nombreCuenta:
 *           type: string
 *           example: "Caja"
 *         movimiento:
 *           type: string
 *           example: "A_MAS"
 *         movimientoAbreviatura:
 *           type: string
 *           example: "A+"
 *         debe:
 *           type: number
 *           example: 50000.00
 *         haber:
 *           type: number
 *           example: 0.00
 *
 *     AsientoContableItem:
 *       type: object
 *       properties:
 *         idAsiento:
 *           type: integer
 *           example: 1
 *         numeroAsiento:
 *           type: integer
 *           example: 1
 *         fechaHecho:
 *           type: string
 *           format: date-time
 *         fechaAsiento:
 *           type: string
 *           format: date-time
 *         conceptoGeneral:
 *           type: string
 *           example: "Aporte inicial de capital"
 *         origen:
 *           type: string
 *           example: "MANUAL"
 *         ventaId:
 *           type: integer
 *           nullable: true
 *         movimientoFinancieroId:
 *           type: integer
 *           nullable: true
 *         conciliacionId:
 *           type: integer
 *           nullable: true
 *         operacionId:
 *           type: integer
 *           nullable: true
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RenglonAsientoDetalle'
 *
 *     CrearAsientoDetalleInput:
 *       type: object
 *       required: [cuentaId, movimiento, debe, haber]
 *       properties:
 *         idDetalle:
 *           type: integer
 *           description: ID del detalle existente (solo si se está editando)
 *         cuentaId:
 *           type: integer
 *           example: 2
 *         movimiento:
 *           type: string
 *           enum: [A_MAS, A_MENOS, P_MAS, P_MENOS, PN, R_MAS, R_MENOS]
 *           example: "A_MAS"
 *         debe:
 *           type: number
 *           example: 50000.00
 *         haber:
 *           type: number
 *           example: 0.00
 *
 *     CrearAsientoRequest:
 *       type: object
 *       required: [conceptoGeneral, detalles]
 *       properties:
 *         conceptoGeneral:
 *           type: string
 *           example: "Aporte inicial de capital"
 *         origen:
 *           type: string
 *           example: "MANUAL"
 *         ventaId:
 *           type: integer
 *         movimientoFinancieroId:
 *           type: integer
 *         conciliacionId:
 *           type: integer
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CrearAsientoDetalleInput'
 */
