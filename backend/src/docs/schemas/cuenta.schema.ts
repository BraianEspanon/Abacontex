/**
 * @openapi
 * components:
 *   schemas:
 *     CuentaRegistrarRequest:
 *       type: object
 *       required:
 *         - codigo
 *         - nombre
 *         - idRubro
 *         - descripcion
 *       properties:
 *         codigo:
 *           type: string
 *           maxLength: 20
 *           example: "1.1.01"
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Caja"
 *         idRubro:
 *           type: integer
 *           example: 1
 *         descripcion:
 *           type: string
 *           maxLength: 255
 *           example: "Dinero en efectivo de libre disponibilidad"
 *
 *     CuentaEditarRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Caja Chica"
 *         descripcion:
 *           type: string
 *           maxLength: 255
 *           example: "Fondo fijo para gastos menores"
 *
 *     RubroCuenta:
 *       type: object
 *       properties:
 *         idRubro:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Disponibilidades"
 *         descripcion:
 *           type: string
 *           example: "Dinero en efectivo y cheques a la vista"
 *
 *     TipoCuentaConRubros:
 *       type: object
 *       properties:
 *         idTipoCuenta:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Activo"
 *         abreviatura:
 *           type: string
 *           example: "A"
 *         descripcion:
 *           type: string
 *           example: "Recursos económicos que posee la empresa"
 *         rubros:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RubroCuenta'
 *
 *     CuentaContable:
 *       type: object
 *       properties:
 *         idCuenta:
 *           type: integer
 *           example: 1
 *         codigo:
 *           type: string
 *           example: "1.1.01"
 *         nombre:
 *           type: string
 *           example: "Caja"
 *         descripcion:
 *           type: string
 *           example: "Dinero en efectivo"
 *         rubro:
 *           type: object
 *           properties:
 *             idRubro:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: "Disponibilidades"
 *             tipoCuenta:
 *               type: object
 *               properties:
 *                 idTipoCuenta:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Activo"
 *                 abreviatura:
 *                   type: string
 *                   example: "A"
 *
 *     CuentasResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaContable'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 45
 *         totalPages:
 *           type: integer
 *           example: 5
 */
