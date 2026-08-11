/**
 * @openapi
 * components:
 *   schemas:
 *     CrearPlanificacionRequest:
 *       type: object
 *       required:
 *         - mesInicio
 *         - mesFin
 *         - detalles
 *       properties:
 *         mesInicio:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 1
 *         mesFin:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 12
 *         detalles:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/DetallePlanificacionRequest'
 *
 *     DetallePlanificacionRequest:
 *       type: object
 *       required:
 *         - mes
 *         - unidadesEstimadas
 *       properties:
 *         mes:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         unidadesEstimadas:
 *           type: integer
 *           minimum: 0
 *           example: 150
 *
 *     ActualizarPlanificacionMensualRequest:
 *       type: object
 *       required:
 *         - unidadesEstimadas
 *       properties:
 *         unidadesEstimadas:
 *           type: integer
 *           minimum: 0
 *           example: 180
 *
 *     PlanificacionAnual:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         empresaId:
 *           type: integer
 *           example: 3
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         mesInicio:
 *           type: integer
 *           example: 1
 *         mesFin:
 *           type: integer
 *           example: 12
 *         detalle:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetallePlanificacion'
 *
 *     DetallePlanificacion:
 *       type: object
 *       properties:
 *         mes:
 *           type: integer
 *           example: 1
 *         unidadesEstimadas:
 *           type: integer
 *           example: 100
 *         unidadesProducidas:
 *           type: integer
 *           example: 80
 *         porcentajeCumplimiento:
 *           type: number
 *           format: float
 *           example: 80
 */
