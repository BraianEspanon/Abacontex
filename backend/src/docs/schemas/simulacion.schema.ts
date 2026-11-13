/**
 * @openapi
 * components:
 *   schemas:
 *     # ---------------------------------------------------------------------------
 *     # 1. Selectores para creación de simulaciones
 *     # ---------------------------------------------------------------------------
 *     DuracionSimulacionOpcion:
 *       type: object
 *       required:
 *         - codigo
 *         - label
 *         - rangoEventos
 *       properties:
 *         codigo:
 *           type: string
 *           enum: [CORTA, MEDIA, LARGA]
 *           example: MEDIA
 *         label:
 *           type: string
 *           example: "Media (6 a 8 eventos)"
 *         rangoEventos:
 *           type: object
 *           required:
 *             - min
 *             - max
 *           properties:
 *             min:
 *               type: integer
 *               example: 6
 *             max:
 *               type: integer
 *               example: 8
 *
 *     OpcionesCrearSimulacionResponse:
 *       type: object
 *       required:
 *         - flujosEmpresariales
 *         - dificultades
 *         - duraciones
 *         - tiposEventoSorpresa
 *       properties:
 *         flujosEmpresariales:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "Ventas y pedidos"
 *             - "Producción y operaciones"
 *             - "Compras y proveedores"
 *             - "Gestión financiera y caja"
 *             - "Recursos humanos y clima laboral"
 *             - "Crisis empresarial y contingencias"
 *             - "Negociación y alianzas estratégicas"
 *             - "Innovación y nuevos productos"
 *             - "Cumplimiento normativo y fiscal"
 *         dificultades:
 *           type: array
 *           items:
 *             type: string
 *             enum: [BASICA, INTERMEDIA, AVANZADA]
 *           example: [BASICA, INTERMEDIA, AVANZADA]
 *         duraciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DuracionSimulacionOpcion'
 *         tiposEventoSorpresa:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "CANCELACION_PEDIDO"
 *             - "AUMENTO_COSTOS"
 *             - "FALLA_MAQUINARIA"
 *             - "RENUNCIA_PERSONAL_CLAVE"
 *             - "DEMORA_PROVEEDOR"
 *             - "AUDITORIA_FISCAL_SORPRESA"
 *             - "CAMBIO_NORMATIVO_BRUSCO"
 *             - "OPORTUNIDAD_COMERCIAL_URGENTE"
 *
 *     # ---------------------------------------------------------------------------
 *     # 2. Listado Docente y Cards de Dashboard
 *     # ---------------------------------------------------------------------------
 *     SimulacionDocenteResumenAvance:
 *       type: object
 *       required:
 *         - empresasComenzaron
 *         - empresasFinalizaron
 *         - totalEmpresas
 *         - porcentajeComenzaron
 *         - porcentajeFinalizaron
 *       properties:
 *         empresasComenzaron:
 *           type: integer
 *           example: 5
 *         empresasFinalizaron:
 *           type: integer
 *           example: 3
 *         totalEmpresas:
 *           type: integer
 *           example: 10
 *         porcentajeComenzaron:
 *           type: integer
 *           example: 50
 *         porcentajeFinalizaron:
 *           type: integer
 *           example: 30
 *
 *     SimulacionDocenteCard:
 *       type: object
 *       required:
 *         - idSimulacion
 *         - titulo
 *         - curso
 *         - estado
 *         - fechaLimite
 *         - resumenAvance
 *         - createdAt
 *       properties:
 *         idSimulacion:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Crisis de Suministro y Negociación de Plazos"
 *         curso:
 *           type: object
 *           required:
 *             - id
 *             - nombre
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: "5° B - Turno Mañana"
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, EN_CURSO, FINALIZADA]
 *           example: EN_CURSO
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *         resumenAvance:
 *           $ref: '#/components/schemas/SimulacionDocenteResumenAvance'
 *         puntajePromedio:
 *           type: integer
 *           nullable: true
 *           example: 85
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-11-12T12:00:00.000Z"
 *
 *     ResumenDashboardDocente:
 *       type: object
 *       required:
 *         - total
 *         - pendientes
 *         - enCurso
 *         - finalizadas
 *       properties:
 *         total:
 *           type: integer
 *           example: 8
 *         pendientes:
 *           type: integer
 *           example: 2
 *         enCurso:
 *           type: integer
 *           example: 4
 *         finalizadas:
 *           type: integer
 *           example: 2
 *
 *     ListadoSimulacionesDocenteResponse:
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
 *             $ref: '#/components/schemas/SimulacionDocenteCard'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 6
 *         totalItems:
 *           type: integer
 *           example: 8
 *         totalPages:
 *           type: integer
 *           example: 2
 *         resumen:
 *           $ref: '#/components/schemas/ResumenDashboardDocente'
 *
 *     # ---------------------------------------------------------------------------
 *     # 3. Creación de Simulación
 *     # ---------------------------------------------------------------------------
 *     CrearSimulacionRequest:
 *       type: object
 *       required:
 *         - cursoId
 *         - fechaLimite
 *         - flujoEmpresarial
 *         - dificultad
 *         - duracion
 *         - eventosSorpresa
 *         - usarDatosEmpresa
 *       properties:
 *         cursoId:
 *           type: integer
 *           example: 1
 *           description: ID del curso al que se asignará la simulación.
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *           description: Plazo límite de realización (debe ser fecha futura).
 *         flujoEmpresarial:
 *           type: string
 *           example: "Producción y operaciones"
 *           description: Uno de los 9 flujos empresariales configurables.
 *         dificultad:
 *           type: string
 *           enum: [BASICA, INTERMEDIA, AVANZADA]
 *           example: INTERMEDIA
 *         duracion:
 *           type: string
 *           enum: [CORTA, MEDIA, LARGA]
 *           example: MEDIA
 *         eventosSorpresa:
 *           type: boolean
 *           example: true
 *         tipoEventoSorpresa:
 *           type: string
 *           nullable: true
 *           example: "DEMORA_PROVEEDOR"
 *         usarDatosEmpresa:
 *           type: boolean
 *           example: true
 *           description: Si true, la IA contextualiza productos, stock y caja real de cada empresa del curso.
 *
 *     SimulacionCreadaResponse:
 *       type: object
 *       required:
 *         - idSimulacion
 *         - titulo
 *         - flujoEmpresarial
 *         - dificultad
 *         - duracion
 *         - eventosSorpresa
 *         - usarDatosEmpresa
 *         - fechaLimite
 *         - estado
 *         - cursoId
 *         - empresasParticipantes
 *         - createdAt
 *       properties:
 *         idSimulacion:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Lanzamiento Estratégico y Crisis de Reputación"
 *         flujoEmpresarial:
 *           type: string
 *           example: "Producción y operaciones"
 *         dificultad:
 *           type: string
 *           example: INTERMEDIA
 *         duracion:
 *           type: string
 *           example: MEDIA
 *         eventosSorpresa:
 *           type: boolean
 *           example: true
 *         usarDatosEmpresa:
 *           type: boolean
 *           example: true
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         cursoId:
 *           type: integer
 *           example: 1
 *         empresasParticipantes:
 *           type: integer
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-11-12T15:30:00.000Z"
 *
 *     # ---------------------------------------------------------------------------
 *     # 4. Edición de Título
 *     # ---------------------------------------------------------------------------
 *     EditarTituloSimulacionRequest:
 *       type: object
 *       required:
 *         - titulo
 *       properties:
 *         titulo:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Desafío de Producción y Reclamo de Clientes"
 *
 *     EditarTituloSimulacionResponse:
 *       type: object
 *       required:
 *         - idSimulacion
 *         - titulo
 *         - updatedAt
 *       properties:
 *         idSimulacion:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Desafío de Producción y Reclamo de Clientes"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-11-12T16:00:00.000Z"
 *
 *     # ---------------------------------------------------------------------------
 *     # 5. Entregas y Avance de Empresas (Docente)
 *     # ---------------------------------------------------------------------------
 *     CabeceraEntregasSimulacion:
 *       type: object
 *       required:
 *         - idSimulacion
 *         - titulo
 *         - curso
 *         - fechaLimite
 *         - tema
 *         - cantEventosTotales
 *         - cantEmpresasComenzaron
 *         - totalEmpresas
 *         - estado
 *       properties:
 *         idSimulacion:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Lanzamiento Estratégico y Crisis de Reputación"
 *         curso:
 *           type: object
 *           required:
 *             - id
 *             - nombre
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: "5° B - Turno Mañana"
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *         fechaFinalizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-12T22:30:00.000Z"
 *         tema:
 *           type: string
 *           example: "Producción y operaciones"
 *         cantEventosTotales:
 *           type: integer
 *           example: 8
 *         cantEmpresasComenzaron:
 *           type: integer
 *           example: 4
 *         totalEmpresas:
 *           type: integer
 *           example: 5
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, EN_CURSO, FINALIZADA]
 *           example: EN_CURSO
 *
 *     EntregaSimulacionEmpresaItem:
 *       type: object
 *       required:
 *         - idSimulacionEmpresa
 *         - empresa
 *         - estado
 *         - integrantes
 *         - rolesInvolucrados
 *         - eventosCompletados
 *         - cantEventosTotales
 *         - porcentajeProgreso
 *       properties:
 *         idSimulacionEmpresa:
 *           type: integer
 *           example: 4
 *         empresa:
 *           type: object
 *           required:
 *             - id
 *             - nombre
 *             - logoUrl
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             nombre:
 *               type: string
 *               example: "TechSolutions S.R.L."
 *             logoUrl:
 *               type: string
 *               nullable: true
 *               example: "https://storage.abacontex.com/logos/tech.png"
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, EN_CURSO, FINALIZADA]
 *           example: EN_CURSO
 *         integrantes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IntegranteEmpresa'
 *         rolesInvolucrados:
 *           type: array
 *           items:
 *             type: string
 *           example: ["CEO", "COO", "CFO"]
 *         fechaFinalizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         ultimaActividad:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-12T22:35:26.437Z"
 *         eventosCompletados:
 *           type: integer
 *           example: 2
 *         cantEventosTotales:
 *           type: integer
 *           example: 8
 *         porcentajeProgreso:
 *           type: integer
 *           example: 25
 *         puntajeFinal:
 *           type: integer
 *           nullable: true
 *           example: null
 *
 *     EntregasSimulacionResponse:
 *       type: object
 *       required:
 *         - cabecera
 *         - items
 *         - page
 *         - pageSize
 *         - totalItems
 *         - totalPages
 *       properties:
 *         cabecera:
 *           $ref: '#/components/schemas/CabeceraEntregasSimulacion'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EntregaSimulacionEmpresaItem'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 6
 *         totalItems:
 *           type: integer
 *           example: 5
 *         totalPages:
 *           type: integer
 *           example: 1
 *
 *     # ---------------------------------------------------------------------------
 *     # 6. Dashboard del Alumno
 *     # ---------------------------------------------------------------------------
 *     SimulacionAlumnoCard:
 *       type: object
 *       required:
 *         - idSimulacionEmpresa
 *         - titulo
 *         - estado
 *         - requiereMiDecision
 *         - eventoActualNumero
 *         - cantEventosTotales
 *         - porcentajeProgreso
 *         - fechaLimite
 *       properties:
 *         idSimulacionEmpresa:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Lanzamiento Estratégico y Crisis de Reputación"
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, EN_CURSO, FINALIZADA]
 *           example: EN_CURSO
 *         requiereMiDecision:
 *           type: boolean
 *           example: true
 *           description: True si la empresa tiene un evento activo y el rol del alumno está habilitado para decidirlo.
 *         eventoActualNumero:
 *           type: integer
 *           example: 2
 *         cantEventosTotales:
 *           type: integer
 *           example: 8
 *         porcentajeProgreso:
 *           type: integer
 *           example: 25
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *         ultimaActividad:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-12T22:35:26.437Z"
 *
 *     ResumenDashboardAlumno:
 *       type: object
 *       required:
 *         - total
 *         - pendientes
 *         - enCurso
 *         - finalizadas
 *         - decisionesPorResponder
 *       properties:
 *         total:
 *           type: integer
 *           example: 4
 *         pendientes:
 *           type: integer
 *           example: 1
 *         enCurso:
 *           type: integer
 *           example: 2
 *         finalizadas:
 *           type: integer
 *           example: 1
 *         decisionesPorResponder:
 *           type: integer
 *           example: 1
 *
 *     OpcionFiltroEstadoAlumno:
 *       type: object
 *       required:
 *         - clave
 *         - label
 *       properties:
 *         clave:
 *           type: string
 *           example: "REQUIERE_MI_DECISION"
 *         label:
 *           type: string
 *           example: "Requieren mi decisión"
 *
 *     FiltrosDashboardAlumnoResponse:
 *       type: object
 *       required:
 *         - estados
 *       properties:
 *         estados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OpcionFiltroEstadoAlumno'
 *
 *     ListadoSimulacionesAlumnoResponse:
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
 *             $ref: '#/components/schemas/SimulacionAlumnoCard'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 6
 *         totalItems:
 *           type: integer
 *           example: 4
 *         totalPages:
 *           type: integer
 *           example: 1
 *         resumen:
 *           $ref: '#/components/schemas/ResumenDashboardAlumno'
 *
 *     # ---------------------------------------------------------------------------
 *     # 7. Sala Conversacional de la Simulación
 *     # ---------------------------------------------------------------------------
 *     IntegranteEmpresa:
 *       type: object
 *       required:
 *         - idAlumno
 *         - nombre
 *         - apellido
 *         - rol
 *         - fotoPerfilUrl
 *       properties:
 *         idAlumno:
 *           type: string
 *           example: "c4b8b609-b3a5-4f40-8480-1a76ef507850"
 *         nombre:
 *           type: string
 *           example: "Martina"
 *         apellido:
 *           type: string
 *           example: "López"
 *         rol:
 *           type: string
 *           example: "Director de Operaciones (COO)"
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *           example: "https://storage.abacontex.com/avatars/martina.jpg"
 *
 *     MensajeConversacionDecision:
 *       type: object
 *       required:
 *         - idDecision
 *         - alumno
 *         - opcionElegida
 *         - fechaDecision
 *       properties:
 *         idDecision:
 *           type: integer
 *           example: 14
 *         alumno:
 *           type: object
 *           required:
 *             - id
 *             - nombre
 *             - apellido
 *             - rol
 *             - fotoPerfilUrl
 *           properties:
 *             id:
 *               type: string
 *               example: "c4b8b609-b3a5-4f40-8480-1a76ef507850"
 *             nombre:
 *               type: string
 *               example: "Martina"
 *             apellido:
 *               type: string
 *               example: "López"
 *             rol:
 *               type: string
 *               example: "Director de Operaciones (COO)"
 *             fotoPerfilUrl:
 *               type: string
 *               nullable: true
 *               example: null
 *         opcionElegida:
 *           type: object
 *           required:
 *             - idOpcion
 *             - texto
 *           properties:
 *             idOpcion:
 *               type: integer
 *               example: 2
 *             texto:
 *               type: string
 *               example: "Ofrecer entregar 50 unidades en 3 días y el saldo restante en 6 días."
 *         fechaDecision:
 *           type: string
 *           format: date-time
 *           example: "2026-11-12T22:35:26.437Z"
 *
 *     MensajeConversacion:
 *       type: object
 *       required:
 *         - id
 *         - tipoMensaje
 *         - emisor
 *         - mensaje
 *         - fecha
 *       properties:
 *         id:
 *           type: string
 *           example: "EV-1"
 *         tipoMensaje:
 *           type: string
 *           enum: [EVENTO_HISTORIA, DECISION_TOMADA]
 *           example: EVENTO_HISTORIA
 *         emisor:
 *           type: string
 *           example: "CLIENTE"
 *         mensaje:
 *           type: string
 *           example: "Hola, necesitamos encargar un pedido urgente de 100 unidades con entrega en 3 días."
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2026-11-12T22:30:00.000Z"
 *         esSorpresa:
 *           type: boolean
 *           example: false
 *         decision:
 *           $ref: '#/components/schemas/MensajeConversacionDecision'
 *
 *     OpcionDecisionActiva:
 *       type: object
 *       required:
 *         - idOpcion
 *         - texto
 *       properties:
 *         idOpcion:
 *           type: integer
 *           example: 3
 *         texto:
 *           type: string
 *           example: "Autorizar horas extra al personal de planta para asegurar la producción."
 *
 *     DecisionActiva:
 *       type: object
 *       required:
 *         - idEvento
 *         - puedeDecidir
 *         - rolRequeridoTexto
 *         - rolesHabilitados
 *         - opciones
 *       properties:
 *         idEvento:
 *           type: integer
 *           example: 5
 *         puedeDecidir:
 *           type: boolean
 *           example: true
 *           description: True si el alumno autenticado posee el rol requerido para responder este acontecimiento.
 *         rolRequeridoTexto:
 *           type: string
 *           example: "Director de Operaciones (COO)"
 *         rolesHabilitados:
 *           type: array
 *           items:
 *             type: string
 *           example: ["COO", "CEO"]
 *         opciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OpcionDecisionActiva'
 *
 *     ConversacionSimulacionResponse:
 *       type: object
 *       required:
 *         - idSimulacionEmpresa
 *         - titulo
 *         - estado
 *         - modo
 *         - progreso
 *         - integrantes
 *         - mensajes
 *       properties:
 *         idSimulacionEmpresa:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Lanzamiento Estratégico y Crisis de Reputación"
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, EN_CURSO, FINALIZADA]
 *           example: EN_CURSO
 *         modo:
 *           type: string
 *           enum: [MODO_INTERACTIVO, MODO_LECTURA]
 *           example: MODO_INTERACTIVO
 *         progreso:
 *           type: object
 *           required:
 *             - eventoActualNumero
 *             - cantEventosTotales
 *             - porcentajeProgreso
 *           properties:
 *             eventoActualNumero:
 *               type: integer
 *               example: 2
 *             cantEventosTotales:
 *               type: integer
 *               example: 8
 *             porcentajeProgreso:
 *               type: integer
 *               example: 25
 *         integrantes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IntegranteEmpresa'
 *         mensajes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MensajeConversacion'
 *         decisionActiva:
 *           $ref: '#/components/schemas/DecisionActiva'
 *           nullable: true
 *
 *     # ---------------------------------------------------------------------------
 *     # 8. Responder Decisión
 *     # ---------------------------------------------------------------------------
 *     ResponderDecisionSimulacionRequest:
 *       type: object
 *       required:
 *         - idOpcion
 *       properties:
 *         idOpcion:
 *           type: integer
 *           example: 2
 *           description: ID de la alternativa elegida por el equipo para el evento activo.
 *
 *     ResponderDecisionSimulacionResponse:
 *       type: object
 *       required:
 *         - mensaje
 *         - finalizada
 *       properties:
 *         mensaje:
 *           type: string
 *           example: "Decisión registrada exitosamente."
 *         finalizada:
 *           type: boolean
 *           example: false
 *           description: True si esta respuesta completó el último evento de la simulación.
 *
 *     # ---------------------------------------------------------------------------
 *     # 9. Resumen y Feedback Final
 *     # ---------------------------------------------------------------------------
 *     FeedbackFinalSimulacion:
 *       type: object
 *       required:
 *         - resumenGeneral
 *         - fortalezas
 *         - aspectosAMejorar
 *         - conclusion
 *       properties:
 *         resumenGeneral:
 *           type: string
 *           example: "El equipo de TechSolutions completó la simulación con un desempeño destacado, demostrando criterio gerencial para balancear tiempos y liquidez."
 *         fortalezas:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "Excelente análisis del impacto en caja antes de confirmar horas extra."
 *             - "Coordinación fluida entre Operaciones y Finanzas."
 *         aspectosAMejorar:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "Monitorear con mayor anticipación los tiempos de entrega de proveedores críticos."
 *         conclusion:
 *           type: string
 *           example: "Gran desempeño colectivo que sienta bases sólidas para la resolución de contingencias empresariales complejas."
 *
 *     DesgloseDecisiones:
 *       type: object
 *       required:
 *         - muyAdecuadas
 *         - adecuadas
 *         - pocoAdecuadas
 *         - inadecuadas
 *         - total
 *       properties:
 *         muyAdecuadas:
 *           type: integer
 *           example: 4
 *         adecuadas:
 *           type: integer
 *           example: 2
 *         pocoAdecuadas:
 *           type: integer
 *           example: 0
 *         inadecuadas:
 *           type: integer
 *           example: 0
 *         total:
 *           type: integer
 *           example: 6
 *
 *     ResumenSimulacionResponse:
 *       type: object
 *       required:
 *         - idSimulacionEmpresa
 *         - titulo
 *         - estado
 *         - empresa
 *         - puntajeFinal
 *         - eventosCompletados
 *         - cantEventosTotales
 *         - fechaLimite
 *         - flujoEmpresarial
 *         - rolesIntervinieron
 *         - desgloseDecisiones
 *         - feedbackFinal
 *         - variablesFinales
 *       properties:
 *         idSimulacionEmpresa:
 *           type: integer
 *           example: 4
 *         titulo:
 *           type: string
 *           example: "Lanzamiento Estratégico y Crisis de Reputación"
 *         estado:
 *           type: string
 *           enum: [FINALIZADA]
 *           example: FINALIZADA
 *         empresa:
 *           type: object
 *           required:
 *             - id
 *             - nombre
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             nombre:
 *               type: string
 *               example: "TechSolutions S.R.L."
 *         puntajeFinal:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 89
 *         eventosCompletados:
 *           type: integer
 *           example: 6
 *         cantEventosTotales:
 *           type: integer
 *           example: 6
 *         fechaInicio:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-12T22:30:00.000Z"
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-12-31T23:59:59.000Z"
 *         fechaFinalizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-11-12T23:00:00.000Z"
 *         flujoEmpresarial:
 *           type: string
 *           example: "Producción y operaciones"
 *         rolesIntervinieron:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Director Ejecutivo (CEO)", "Director de Operaciones (COO)", "Director Financiero (CFO)"]
 *         desgloseDecisiones:
 *           $ref: '#/components/schemas/DesgloseDecisiones'
 *         feedbackFinal:
 *           $ref: '#/components/schemas/FeedbackFinalSimulacion'
 *         variablesFinales:
 *           type: object
 *           example:
 *             stock: 45
 *             caja: 1850000
 *             reputacion: 92
 */
