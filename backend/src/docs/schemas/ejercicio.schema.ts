/**
 * @openapi
 * components:
 *   schemas:
 *     DigitalizarEjercicioRequest:
 *       type: object
 *       required:
 *         - archivo
 *       properties:
 *         archivo:
 *           type: string
 *           format: binary
 *           description: Documento escaneado, foto o PDF del enunciado contable. Formatos permitidos JPG, PNG, WEBP o PDF. Tamaño máximo 10 MB (configurable).
 *
 *     DigitalizarEjercicioResponse:
 *       type: object
 *       required:
 *         - enunciadoTexto
 *       properties:
 *         enunciadoTexto:
 *           type: string
 *           example: "### Distribuidora Norte S.R.L.\n\n1. 02/05 - **Factura Original N° 0001-00004523** por compra de mercaderías por $ 150.000,00 abonando en efectivo."
 *           description: Texto transcripto del enunciado estructurado en formato Markdown (GFM).
 *
 *     GenerarEjercicioRequest:
 *       type: object
 *       required:
 *         - cursoId
 *         - tipoEjercicio
 *         - dificultad
 *       properties:
 *         cursoId:
 *           type: integer
 *           example: 1
 *           description: ID del curso al que pertenece el ejercicio. Determina el año (5.° o 6.° año) para encuadre societario (S.R.L. vs S.A.) y curricular.
 *         tipoEjercicio:
 *           type: string
 *           enum:
 *             - COMPRAS_VENTAS_BASICAS
 *             - OPERACIONES_COMERCIALES_INTEGRADAS
 *             - AJUSTES_HOJA_TRABAJO
 *             - COSTOS_PROCESO_PRODUCTIVO
 *           example: COMPRAS_VENTAS_BASICAS
 *           description: Categoría temática del ejercicio contable.
 *         dificultad:
 *           type: string
 *           enum:
 *             - BASICO
 *             - INTERMEDIO
 *             - AVANZADO
 *           example: INTERMEDIO
 *           description: Nivel de dificultad y cantidad de operaciones requeridas.
 *         contenidosAdicionales:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - IVA
 *               - INTERESES
 *               - DESCUENTOS
 *           example:
 *             - IVA
 *             - INTERESES
 *           description: Contenidos adicionales obligatorios para ejercicios de compras y ventas.
 *         contextoAdicional:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *           example: Empresa dedicada a la venta de artículos de librería y papelería comercial.
 *           description: Indicación libre y acotada del docente sobre el rubro comercial o contexto situacional (máximo 200 caracteres).
 *
 *     GenerarEjercicioResponse:
 *       type: object
 *       required:
 *         - enunciadoTexto
 *       properties:
 *         enunciadoTexto:
 *           type: string
 *           example: "**Distribuidora del Centro S.R.L.**\n\n1. 02/05 – **Factura Original N.° 001** por compra de 200 cuadernos..."
 *           description: Enunciado contable completo generado por IA, estructurado en Markdown (GFM) listo para el aula.
 *
 *     OpcionesGeneracionResponse:
 *       type: object
 *       required:
 *         - tiposEjercicio
 *         - dificultades
 *         - contenidosAdicionales
 *       properties:
 *         tiposEjercicio:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - label
 *               - permiteContenidosAdicionales
 *             properties:
 *               id:
 *                 type: string
 *                 example: COMPRAS_VENTAS_BASICAS
 *               label:
 *                 type: string
 *                 example: Compras y ventas básicas
 *               permiteContenidosAdicionales:
 *                 type: boolean
 *                 example: true
 *         dificultades:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - label
 *             properties:
 *               id:
 *                 type: string
 *                 example: INTERMEDIO
 *               label:
 *                 type: string
 *                 example: Intermedio (~6 operaciones)
 *         contenidosAdicionales:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - label
 *             properties:
 *               id:
 *                 type: string
 *                 example: IVA
 *               label:
 *                 type: string
 *                 example: Incluir IVA (21%)
 */
