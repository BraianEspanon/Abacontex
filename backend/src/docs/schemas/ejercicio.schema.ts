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
 *
 *     CursoEjercicioResponse:
 *       type: object
 *       required:
 *         - idCurso
 *         - nombreCurso
 *         - año
 *       properties:
 *         idCurso:
 *           type: integer
 *           example: 1
 *         nombreCurso:
 *           type: string
 *           example: 5to I
 *         año:
 *           type: integer
 *           example: 5
 *
 *     PlantillaEjercicioResponse:
 *       type: object
 *       required:
 *         - idEjercicioPlantilla
 *         - tipo
 *       properties:
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *             - HOJA_TRABAJO
 *           example: LIBRO_DIARIO
 *
 *     GeneracionIAResponse:
 *       type: object
 *       required:
 *         - idGeneracion
 *         - tipoEjercicio
 *         - dificultad
 *         - contenidos
 *       properties:
 *         idGeneracion:
 *           type: integer
 *           example: 1
 *         tipoEjercicio:
 *           type: string
 *           example: COMPRAS_VENTAS_BASICAS
 *         dificultad:
 *           type: string
 *           example: INTERMEDIO
 *         contextoAdicional:
 *           type: string
 *           nullable: true
 *           example: Empresa dedicada al rubro librería comercial.
 *         contenidos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - IVA
 *             - INTERESES
 *
 *     ResolucionDocenteResumenResponse:
 *       type: object
 *       required:
 *         - idResolucion
 *         - estado
 *       properties:
 *         idResolucion:
 *           type: integer
 *           example: 1
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_EDICION
 *             - RESUELTO
 *           example: PENDIENTE
 *
 *     ProgresoEntregasResponse:
 *       type: object
 *       required:
 *         - totalAlumnos
 *         - entregasCorregidas
 *         - entregasPendientes
 *         - sinEntregar
 *         - porcentajeEntrega
 *       properties:
 *         totalAlumnos:
 *           type: integer
 *           example: 28
 *         entregasCorregidas:
 *           type: integer
 *           example: 0
 *         entregasPendientes:
 *           type: integer
 *           example: 0
 *         sinEntregar:
 *           type: integer
 *           example: 28
 *         porcentajeEntrega:
 *           type: number
 *           example: 0
 *
 *     EjercicioItemResponse:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - curso
 *         - estado
 *         - fechaLimite
 *         - totalEntregas
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Práctico N° 1 - Compras y Ventas Básicas
 *         curso:
 *           $ref: '#/components/schemas/CursoEjercicioResponse'
 *         estado:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *             - SIN_RESOLVER
 *             - EN_CORRECCION
 *             - COMPLETADO
 *           example: SIN_RESOLVER
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-11-30T23:59:59.000Z'
 *         totalEntregas:
 *           type: integer
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *
 *     ResumenEjerciciosResponse:
 *       type: object
 *       required:
 *         - total
 *         - enviados
 *         - sinResolver
 *         - enCorreccion
 *       properties:
 *         total:
 *           type: integer
 *           example: 6
 *           description: Total de ejercicios pertenecientes al docente.
 *         enviados:
 *           type: integer
 *           example: 3
 *           description: Ejercicios publicados a los alumnos que cuentan con su resolución modelo completa.
 *         sinResolver:
 *           type: integer
 *           example: 2
 *           description: Ejercicios publicados a los alumnos cuya resolución modelo está pendiente de resolución.
 *         enCorreccion:
 *           type: integer
 *           example: 0
 *           description: Ejercicios que tienen entregas de alumnos pendientes de corrección (Fase 2).
 *
 *     ListadoEjerciciosResponse:
 *       type: object
 *       required:
 *         - items
 *         - page
 *         - pageSize
 *         - totalItems
 *         - totalPages
 *         - resumen
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EjercicioItemResponse'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 6
 *         totalItems:
 *           type: integer
 *           example: 6
 *         totalPages:
 *           type: integer
 *           example: 1
 *         resumen:
 *           $ref: '#/components/schemas/ResumenEjerciciosResponse'
 *
 *     CrearEjercicioRequest:
 *       type: object
 *       required:
 *         - titulo
 *         - cursoId
 *         - enunciado
 *         - fechaLimite
 *         - plantillas
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 100
 *           example: Práctico N° 1 - Compras y Ventas Básicas
 *           description: Título descriptivo de la actividad (máximo 100 caracteres).
 *         cursoId:
 *           type: integer
 *           example: 1
 *           description: ID del curso al que pertenece el ejercicio.
 *         enunciado:
 *           type: string
 *           example: "**Distribuidora del Centro S.R.L.**\n\n1. 02/05 - Factura Original N° 001..."
 *           description: Enunciado contable estructurado en formato Markdown (GFM).
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-11-30T23:59:59.000Z'
 *           description: Fecha y hora límite de entrega en formato ISO 8601 (debe ser futura).
 *         indicaciones:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *           example: Recordar registrar comprobantes y mayorizar todas las cuentas.
 *           description: Observaciones o pautas adicionales para los alumnos (máximo 200 caracteres).
 *         estado:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *           default: BORRADOR
 *           example: BORRADOR
 *           description: Estado inicial. Si se selecciona ENVIADO, se publica inmediatamente para el curso.
 *         plantillas:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - LIBRO_DIARIO
 *               - LIBRO_MAYOR
 *               - LIBRO_IVA
 *               - HOJA_TRABAJO
 *           example:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *           description: Plantillas contables que los alumnos deberán resolver obligatoriamente.
 *         generacionIA:
 *           type: object
 *           nullable: true
 *           properties:
 *             tipoEjercicio:
 *               type: string
 *               enum:
 *                 - COMPRAS_VENTAS_BASICAS
 *                 - OPERACIONES_COMERCIALES_INTEGRADAS
 *                 - AJUSTES_HOJA_TRABAJO
 *                 - COSTOS_PROCESO_PRODUCTIVO
 *               example: COMPRAS_VENTAS_BASICAS
 *             dificultad:
 *               type: string
 *               enum:
 *                 - BASICO
 *                 - INTERMEDIO
 *                 - AVANZADO
 *               example: INTERMEDIO
 *             contextoAdicional:
 *               type: string
 *               maxLength: 200
 *               nullable: true
 *               example: Empresa del rubro artículos de librería.
 *             contenidos:
 *               type: array
 *               items:
 *                 type: string
 *                 enum:
 *                   - IVA
 *                   - INTERESES
 *                   - DESCUENTOS
 *               example:
 *                 - IVA
 *
 *     EjercicioCreadoResponse:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - enunciado
 *         - estado
 *         - fechaLimite
 *         - curso
 *         - plantillas
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Práctico N° 1 - Compras y Ventas Básicas
 *         enunciado:
 *           type: string
 *           example: "**Distribuidora del Centro S.R.L.**\n\n1. 02/05 - Factura Original N° 001..."
 *         estado:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *             - SIN_RESOLVER
 *             - EN_CORRECCION
 *             - COMPLETADO
 *           example: BORRADOR
 *         indicaciones:
 *           type: string
 *           nullable: true
 *           example: Recordar registrar comprobantes y mayorizar.
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-11-30T23:59:59.000Z'
 *         curso:
 *           $ref: '#/components/schemas/CursoEjercicioResponse'
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlantillaEjercicioResponse'
 *         generacionIA:
 *           $ref: '#/components/schemas/GeneracionIAResponse'
 *         resolucion:
 *           $ref: '#/components/schemas/ResolucionDocenteResumenResponse'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *
 *     EditarEjercicioRequest:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           maxLength: 100
 *           example: Práctico N° 1 - Actualizado
 *         cursoId:
 *           type: integer
 *           example: 1
 *         enunciado:
 *           type: string
 *           example: "**Enunciado actualizado con nuevas operaciones...**"
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-12-15T23:59:59.000Z'
 *         indicaciones:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *           example: Nuevas pautas para el cierre del ejercicio.
 *         estado:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *           example: ENVIADO
 *           description: Permite publicar un ejercicio que estaba en borrador.
 *         plantillas:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - LIBRO_DIARIO
 *               - LIBRO_MAYOR
 *               - LIBRO_IVA
 *               - HOJA_TRABAJO
 *           example:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *
 *     DetalleEjercicioResponse:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - enunciado
 *         - estado
 *         - fechaLimite
 *         - origen
 *         - curso
 *         - plantillas
 *         - progresoEntregas
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Práctico N° 1 - Compras y Ventas Básicas
 *         enunciado:
 *           type: string
 *           example: "**Distribuidora del Centro S.R.L.**\n\n1. 02/05 - Factura Original N° 001..."
 *         estado:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - ENVIADO
 *             - SIN_RESOLVER
 *             - EN_CORRECCION
 *             - COMPLETADO
 *           example: SIN_RESOLVER
 *         indicaciones:
 *           type: string
 *           nullable: true
 *           example: Registrar todas las compras y ventas en Diario y Mayor.
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-11-30T23:59:59.000Z'
 *         origen:
 *           type: string
 *           enum:
 *             - IA
 *             - DIGITALIZADO
 *           example: IA
 *         curso:
 *           $ref: '#/components/schemas/CursoEjercicioResponse'
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlantillaEjercicioResponse'
 *         generacionIA:
 *           $ref: '#/components/schemas/GeneracionIAResponse'
 *         resolucionDocente:
 *           $ref: '#/components/schemas/ResolucionDocenteResumenResponse'
 *         progresoEntregas:
 *           $ref: '#/components/schemas/ProgresoEntregasResponse'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2026-10-01T14:30:00.000Z'
 *
 *     ResolucionPlantillaItemResponse:
 *       type: object
 *       required:
 *         - idEjercicioPlantilla
 *         - tipo
 *         - estado
 *         - contenido
 *       properties:
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *             - HOJA_TRABAJO
 *           example: LIBRO_DIARIO
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_EDICION
 *             - RESUELTO
 *           example: RESUELTO
 *         contenido:
 *           type: object
 *           nullable: true
 *           description: Contenido JSON de la plantilla resuelta por el docente.
 *
 *     ResolucionDocenteResponse:
 *       type: object
 *       required:
 *         - idResolucion
 *         - idEjercicio
 *         - titulo
 *         - enunciado
 *         - fechaLimite
 *         - estado
 *         - plantillas
 *       properties:
 *         idResolucion:
 *           type: integer
 *           example: 1
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Práctico N° 1 - Compras y Ventas Básicas
 *         enunciado:
 *           type: string
 *           example: "**Distribuidora del Centro S.R.L.**..."
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: '2026-11-30T23:59:59.000Z'
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_EDICION
 *             - RESUELTO
 *           example: RESUELTO
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResolucionPlantillaItemResponse'
 *
 *     AsientoLineaRequest:
 *       type: object
 *       required:
 *         - idCuenta
 *         - cuenta
 *         - movimiento
 *       properties:
 *         idCuenta:
 *           type: integer
 *           example: 1
 *           description: ID de la cuenta contable seleccionada del catálogo.
 *         cuenta:
 *           type: string
 *           example: Caja
 *           description: Nombre de la cuenta contable.
 *         movimiento:
 *           type: string
 *           enum: [A+, A-, P+, P-, PN, R+, R-]
 *           example: A+
 *           description: Tipo de variación patrimonial del movimiento contable.
 *         folio:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: Folio de pase al Libro Mayor.
 *         debe:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 150000
 *         haber:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 0
 *
 *     AsientoLibroDiarioRequest:
 *       type: object
 *       required:
 *         - numero
 *         - fecha
 *         - lineas
 *       properties:
 *         numero:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: Número correlativo y único del asiento contable.
 *         fecha:
 *           type: string
 *           pattern: '^\\d{2}/\\d{2}/\\d{4}$'
 *           example: '02/05/2026'
 *           description: Fecha contable obligatoria en formato DD/MM/AAAA.
 *         concepto:
 *           type: string
 *           example: Por compra de mercaderías s/ Factura Original N° 001
 *           default: ''
 *         lineas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AsientoLineaRequest'
 *
 *     LibroDiarioContenidoRequest:
 *       type: object
 *       properties:
 *         asientos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AsientoLibroDiarioRequest'
 *
 *     MovimientoMayorRequest:
 *       type: object
 *       properties:
 *         fecha:
 *           type: string
 *           pattern: '^\\d{2}/\\d{2}/\\d{4}$'
 *           nullable: true
 *           example: '02/05/2026'
 *           description: Fecha en formato DD/MM/AAAA (opcional).
 *         concepto:
 *           type: string
 *           example: Asiento N° 1
 *           default: ''
 *         debe:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 150000
 *         haber:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 0
 *         saldo:
 *           type: number
 *           nullable: true
 *           example: 150000
 *
 *     CuentaMayorRequest:
 *       type: object
 *       required:
 *         - cuenta
 *       properties:
 *         idCuenta:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         cuenta:
 *           type: string
 *           example: Caja
 *         movimientos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MovimientoMayorRequest'
 *         saldoFinal:
 *           type: number
 *           nullable: true
 *           example: 150000
 *         tipoSaldo:
 *           type: string
 *           enum: [DEUDOR, ACREEDOR]
 *           nullable: true
 *           example: DEUDOR
 *
 *     LibroMayorContenidoRequest:
 *       type: object
 *       properties:
 *         cuentas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CuentaMayorRequest'
 *
 *     ComprobanteIvaCompraRequest:
 *       type: object
 *       required:
 *         - fecha
 *         - comprobante
 *         - proveedor
 *         - netoGravado
 *         - iva
 *         - total
 *       properties:
 *         fecha:
 *           type: string
 *           pattern: '^\\d{2}/\\d{2}/\\d{4}$'
 *           example: '02/05/2026'
 *         comprobante:
 *           type: string
 *           example: Factura A N° 0001-00001234
 *         proveedor:
 *           type: string
 *           example: Distribuidora Mayorista S.A.
 *         netoGravado:
 *           type: number
 *           minimum: 0
 *           example: 100000
 *         iva:
 *           type: number
 *           minimum: 0
 *           example: 21000
 *         total:
 *           type: number
 *           minimum: 0
 *           example: 121000
 *
 *     ComprobanteIvaVentaRequest:
 *       type: object
 *       required:
 *         - fecha
 *         - comprobante
 *         - comprador
 *         - netoGravado
 *         - iva
 *         - total
 *       properties:
 *         fecha:
 *           type: string
 *           pattern: '^\\d{2}/\\d{2}/\\d{4}$'
 *           example: '05/05/2026'
 *         comprobante:
 *           type: string
 *           example: Factura A N° 0001-00000001
 *         comprador:
 *           type: string
 *           example: Librería Belgrano S.R.L.
 *         netoGravado:
 *           type: number
 *           minimum: 0
 *           example: 200000
 *         iva:
 *           type: number
 *           minimum: 0
 *           example: 42000
 *         total:
 *           type: number
 *           minimum: 0
 *           example: 242000
 *
 *     LibroIvaContenidoRequest:
 *       type: object
 *       properties:
 *         compras:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComprobanteIvaCompraRequest'
 *         ventas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComprobanteIvaVentaRequest'
 *         totalIvaCreditoFiscal:
 *           type: number
 *           nullable: true
 *           example: 21000
 *         totalIvaDebitoFiscal:
 *           type: number
 *           nullable: true
 *           example: 42000
 *         saldoIva:
 *           type: number
 *           nullable: true
 *           example: 21000
 *         tipoSaldo:
 *           type: string
 *           enum: [A_FAVOR_CONTRIBUYENTE, A_PAGAR]
 *           nullable: true
 *           example: A_PAGAR
 *
 *     FilaHojaTrabajoRequest:
 *       type: object
 *       required:
 *         - cuenta
 *       properties:
 *         idCuenta:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         cuenta:
 *           type: string
 *           example: Caja
 *         saldosSinAjustar:
 *           type: object
 *           properties:
 *             deudor:
 *               type: number
 *               example: 150000
 *             acreedor:
 *               type: number
 *               example: 0
 *         ajustes:
 *           type: object
 *           properties:
 *             debe:
 *               type: number
 *               example: 0
 *             haber:
 *               type: number
 *               example: 0
 *         saldosAjustados:
 *           type: object
 *           properties:
 *             deudor:
 *               type: number
 *               example: 150000
 *             acreedor:
 *               type: number
 *               example: 0
 *         estadoPatrimonial:
 *           type: object
 *           properties:
 *             activo:
 *               type: number
 *               example: 150000
 *             pasivoMasPn:
 *               type: number
 *               example: 0
 *         estadoResultados:
 *           type: object
 *           properties:
 *             negativo:
 *               type: number
 *               example: 0
 *             positivo:
 *               type: number
 *               example: 0
 *
 *     HojaTrabajoContenidoRequest:
 *       type: object
 *       properties:
 *         filas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FilaHojaTrabajoRequest'
 *         resultadoEjercicio:
 *           type: number
 *           nullable: true
 *           example: 45000
 *
 *     ActualizarResolucionDocenteRequest:
 *       type: object
 *       required:
 *         - tipo
 *         - contenido
 *       properties:
 *         tipo:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *             - HOJA_TRABAJO
 *           example: LIBRO_DIARIO
 *           description: Tipo de plantilla contable que se está guardando.
 *         estado:
 *           type: string
 *           enum:
 *             - EN_EDICION
 *             - RESUELTO
 *           default: EN_EDICION
 *           example: RESUELTO
 *           description: Estado de la plantilla. Si es RESUELTO se ejecutan las validaciones contables de partida doble.
 *         contenido:
 *           oneOf:
 *             - $ref: '#/components/schemas/LibroDiarioContenidoRequest'
 *             - $ref: '#/components/schemas/LibroMayorContenidoRequest'
 *             - $ref: '#/components/schemas/LibroIvaContenidoRequest'
 *             - $ref: '#/components/schemas/HojaTrabajoContenidoRequest'
 *           description: Contenido estructurado correspondiente al tipo de plantilla seleccionado.
 */
