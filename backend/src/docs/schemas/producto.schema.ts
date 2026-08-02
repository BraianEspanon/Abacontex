/**
 * @openapi
 * components:
 *   schemas:
 *     ProductoCrearRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - stockInicial
 *         - precioUnitario
 *         - descripcion
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: Cinta adhesiva
 *         stockInicial:
 *           type: integer
 *           minimum: 0
 *           example: 25
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 120.5
 *         descripcion:
 *           type: string
 *           maxLength: 250
 *           example: Cinta adhesiva para embalaje industrial.
 *         foto:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen para la foto del producto. Formatos permitidos: JPG, PNG y WEBP. Tamaño máximo: 5 MB.
 *
 *     ProductoActualizarRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - precioUnitario
 *         - descripcion
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: Cinta adhesiva premium
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 135.75
 *         descripcion:
 *           type: string
 *           maxLength: 250
 *           example: Cinta adhesiva premium para embalaje.
 *         foto:
 *           type: string
 *           format: binary
 *           description: Nuevo archivo de imagen para reemplazar la foto actual. Formatos permitidos: JPG, PNG y WEBP. Tamaño máximo: 5 MB.
 *         eliminarFoto:
 *           type: boolean
 *           example: false
 *           description: Si es true, elimina la foto actual sin reemplazarla por una nueva.
 *
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         nombre:
 *           type: string
 *           example: Cinta adhesiva
 *         descripcion:
 *           type: string
 *           example: Cinta adhesiva para embalaje industrial.
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 120.5
 *         stock:
 *           type: integer
 *           example: 25
 *         fotoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/productos/cinta.jpg
 *         empresaId:
 *           type: integer
 *           example: 3
 *         activo:
 *           type: boolean
 *           example: true
 *
 *     ProductosResponse:
 *       type: object
 *       properties:
 *         resumen:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 42
 *             conStock:
 *               type: integer
 *               example: 18
 *             sinStock:
 *               type: integer
 *               example: 24
 *             valorEstimado:
 *               type: number
 *               format: float
 *               example: 12500.75
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoListado'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 42
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     ProductoListado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         nombre:
 *           type: string
 *           example: Cinta adhesiva
 *         fotoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/productos/cinta.jpg
 *         precioUnitario:
 *           type: number
 *           format: float
 *           example: 120.5
 *         stock:
 *           type: integer
 *           example: 25
 */
