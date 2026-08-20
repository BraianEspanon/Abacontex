/**
 * @swagger
 * components:
 *   schemas:
 *     FacturaResumen:
 *       type: object
 *       properties:
 *         facturasEmitidas:
 *           type: integer
 *         ventasPendientes:
 *           type: integer
 *         facturacionMes:
 *           type: number
 *         montoFacturado:
 *           type: number
 *
 *     FacturaListItem:
 *       type: object
 *       properties:
 *         idFactura:
 *           type: integer
 *         idVenta:
 *           type: integer
 *         cliente:
 *           type: string
 *         condicionFiscal:
 *           type: string
 *         fecha:
 *           type: string
 *           format: date-time
 *         tipoFactura:
 *           type: string
 *           enum: [A, B]
 *         montoTotal:
 *           type: number
 *
 *     FacturaListResponse:
 *       type: object
 *       properties:
 *         resumen:
 *           $ref: '#/components/schemas/FacturaResumen'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FacturaListItem'
 *         page:
 *           type: integer
 *         pageSize:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         totalPages:
 *           type: integer
 *
 *     VentaPendienteFacturacion:
 *       type: object
 *       properties:
 *         idVenta:
 *           type: integer
 *         cliente:
 *           type: string
 *         montoTotal:
 *           type: number
 *
 *     VentaPendienteFacturacionResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VentaPendienteFacturacion'
 *         page:
 *           type: integer
 *         pageSize:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         totalPages:
 *           type: integer
 *
 *     GenerarFacturaRequest:
 *       type: object
 *       required:
 *         - ventaId
 *         - tipoFactura
 *         - condicionFiscal
 *       properties:
 *         ventaId:
 *           type: integer
 *         tipoFactura:
 *           type: string
 *           enum: [A, B]
 *         condicionFiscal:
 *           type: string
 *           enum: [RESPONSABLE_INSCRIPTO, CONSUMIDOR_FINAL]
 *
 *     FacturaDetalle:
 *       type: object
 *       properties:
 *         idFactura:
 *           type: integer
 *         tipoFactura:
 *           type: string
 *           enum: [A, B]
 *         fechaEmision:
 *           type: string
 *           format: date-time
 *         cai:
 *           type: string
 *         fechaVencimiento:
 *           type: string
 *           format: date-time
 *         empresa:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             fechaCreacion:
 *               type: string
 *               format: date-time
 *         cliente:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             email:
 *               type: string
 *             condicionFiscal:
 *               type: string
 *             localidad:
 *               type: string
 *         condicionVenta:
 *           type: string
 *         detalles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               detalle:
 *                 type: string
 *               precioUnitario:
 *                 type: number
 *               importe:
 *                 type: number
 *         totales:
 *           type: object
 *           properties:
 *             netoGravado:
 *               type: number
 *             tipoAjuste:
 *               type: string
 *             porcentajeAjuste:
 *               type: number
 *             importeAjuste:
 *               type: number
 *             porcentajeInteres:
 *               type: number
 *             importeInteres:
 *               type: number
 *             porcentajeIva:
 *               type: number
 *             importeIva:
 *               type: number
 *             totalFinal:
 *               type: number
 */
