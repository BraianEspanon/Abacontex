/**
 * @openapi
 * components:
 *   schemas:
 *     ResumenTableroCorrecciones:
 *       type: object
 *       required:
 *         - total
 *         - sinEntregas
 *         - pendientes
 *         - enCorreccion
 *         - corregidos
 *       properties:
 *         total:
 *           type: integer
 *           example: 10
 *           description: Total de ejercicios publicados a cargo del docente.
 *         sinEntregas:
 *           type: integer
 *           example: 3
 *           description: Ejercicios donde ningún alumno entregó todavía.
 *         pendientes:
 *           type: integer
 *           example: 4
 *           description: Ejercicios con entregas que aún no comenzaron a corregirse.
 *         enCorreccion:
 *           type: integer
 *           example: 2
 *           description: Ejercicios con correcciones iniciadas o parciales.
 *         corregidos:
 *           type: integer
 *           example: 1
 *           description: Ejercicios donde todas las entregas recibidas ya fueron corregidas.
 *
 *     ItemTableroCorreccion:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - curso
 *         - fechaLimite
 *         - estado
 *         - plantillasHabilitadas
 *         - totalAlumnos
 *         - totalEntregasRecibidas
 *         - entregasCorregidas
 *         - entregasPendientes
 *         - cantidadSinEntregar
 *         - tieneResolucionDocente
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *           description: ID único del ejercicio.
 *         titulo:
 *           type: string
 *           example: "Registración de Compras y Ventas"
 *         curso:
 *           type: object
 *           required:
 *             - idCurso
 *             - nombreCurso
 *           properties:
 *             idCurso:
 *               type: integer
 *               example: 2
 *             nombreCurso:
 *               type: string
 *               example: "6° II"
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-10-25T23:59:59.000Z"
 *         estado:
 *           type: string
 *           enum:
 *             - SIN_ENTREGAS
 *             - PENDIENTE
 *             - EN_CORRECCION
 *             - CORREGIDO
 *           example: "EN_CORRECCION"
 *           description: Estado global de corrección del ejercicio según entregas.
 *         plantillasHabilitadas:
 *           type: array
 *           items:
 *             type: string
 *           example: ["LIBRO_DIARIO", "LIBRO_MAYOR"]
 *         totalAlumnos:
 *           type: integer
 *           example: 28
 *         totalEntregasRecibidas:
 *           type: integer
 *           example: 20
 *         entregasCorregidas:
 *           type: integer
 *           example: 12
 *         entregasPendientes:
 *           type: integer
 *           example: 8
 *         cantidadSinEntregar:
 *           type: integer
 *           example: 8
 *         tieneResolucionDocente:
 *           type: boolean
 *           example: true
 *           description: Indica si el ejercicio cuenta con solución modelo del docente.
 *
 *     ListadoEjerciciosACorregirResponse:
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
 *             $ref: '#/components/schemas/ItemTableroCorreccion'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 6
 *         totalItems:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 2
 *         resumen:
 *           $ref: '#/components/schemas/ResumenTableroCorrecciones'
 *
 *     OpcionesFiltrosCorreccionResponse:
 *       type: object
 *       required:
 *         - cursos
 *         - estados
 *       properties:
 *         cursos:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - idCurso
 *               - nombreCurso
 *             properties:
 *               idCurso:
 *                 type: integer
 *                 example: 1
 *               nombreCurso:
 *                 type: string
 *                 example: "6° II"
 *         estados:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - clave
 *               - label
 *             properties:
 *               clave:
 *                 type: string
 *                 example: "EN_CORRECCION"
 *               label:
 *                 type: string
 *                 example: "En corrección"
 *
 *     CabeceraEjercicioEntregas:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - fechaLimite
 *         - curso
 *         - plantillasHabilitadas
 *         - totalAlumnos
 *         - totalEntregasRecibidas
 *         - entregasCorregidas
 *         - entregasPendientes
 *         - cantidadSinEntregar
 *         - tieneResolucionDocente
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Registración de Compras y Ventas"
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-10-25T23:59:59.000Z"
 *         curso:
 *           type: object
 *           required:
 *             - idCurso
 *             - nombreCurso
 *           properties:
 *             idCurso:
 *               type: integer
 *               example: 1
 *             nombreCurso:
 *               type: string
 *               example: "6° II"
 *         plantillasHabilitadas:
 *           type: array
 *           items:
 *             type: string
 *           example: ["LIBRO_DIARIO", "LIBRO_MAYOR"]
 *         totalAlumnos:
 *           type: integer
 *           example: 28
 *         totalEntregasRecibidas:
 *           type: integer
 *           example: 20
 *         entregasCorregidas:
 *           type: integer
 *           example: 12
 *         entregasPendientes:
 *           type: integer
 *           example: 8
 *         cantidadSinEntregar:
 *           type: integer
 *           example: 8
 *         tieneResolucionDocente:
 *           type: boolean
 *           example: true
 *
 *     ItemAlumnoEntrega:
 *       type: object
 *       required:
 *         - idAlumno
 *         - nombre
 *         - apellido
 *         - email
 *         - fueraDeTermino
 *         - estado
 *         - totalPlantillas
 *         - plantillasResueltas
 *         - plantillasCorregidas
 *         - tieneRetroalimentacion
 *       properties:
 *         idAlumno:
 *           type: string
 *           example: "alu-uuid-1234"
 *         nombre:
 *           type: string
 *           example: "Braian"
 *         apellido:
 *           type: string
 *           example: "Gómez"
 *         email:
 *           type: string
 *           example: "braian@alumno.abacontex.com"
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         idEntrega:
 *           type: integer
 *           nullable: true
 *           example: 4
 *         fechaEntrega:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-10-24T15:30:00.000Z"
 *         fueraDeTermino:
 *           type: boolean
 *           example: false
 *         estado:
 *           type: string
 *           enum:
 *             - SIN_ENTREGAR
 *             - PENDIENTE
 *             - EN_CORRECCION
 *             - CORREGIDA
 *           example: "EN_CORRECCION"
 *         totalPlantillas:
 *           type: integer
 *           example: 2
 *         plantillasResueltas:
 *           type: integer
 *           example: 2
 *         plantillasCorregidas:
 *           type: integer
 *           example: 1
 *         tieneRetroalimentacion:
 *           type: boolean
 *           example: true
 *
 *     ListadoEntregasEjercicioResponse:
 *       type: object
 *       required:
 *         - items
 *         - page
 *         - pageSize
 *         - totalItems
 *         - totalPages
 *         - ejercicio
 *         - filtros
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemAlumnoEntrega'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 28
 *         totalPages:
 *           type: integer
 *           example: 3
 *         ejercicio:
 *           $ref: '#/components/schemas/CabeceraEjercicioEntregas'
 *         filtros:
 *           type: object
 *           required:
 *             - estados
 *           properties:
 *             estados:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clave:
 *                     type: string
 *                     example: "PENDIENTE"
 *                   label:
 *                     type: string
 *                     example: "Pendiente"
 *
 *     KpisCorreccion:
 *       type: object
 *       required:
 *         - aciertos
 *         - diferenciasDetectadas
 *         - asientosIncompletos
 *         - totalErrores
 *       properties:
 *         aciertos:
 *           type: integer
 *           example: 18
 *           description: Total de celdas o movimientos contables correctos.
 *         diferenciasDetectadas:
 *           type: integer
 *           example: 4
 *           description: Discrepancias numéricas o de cuentas detectadas.
 *         asientosIncompletos:
 *           type: integer
 *           example: 0
 *           description: Asientos con partidas faltantes o desbalanceados.
 *         totalErrores:
 *           type: integer
 *           example: 4
 *
 *     ControlAsistenciaIa:
 *       type: object
 *       required:
 *         - puedeSugerirIa
 *         - motivoDeshabilitadoIa
 *       properties:
 *         puedeSugerirIa:
 *           type: boolean
 *           example: true
 *           description: True únicamente si hay 3 o más errores contables detectados.
 *         motivoDeshabilitadoIa:
 *           type: string
 *           nullable: true
 *           example: null
 *           description: Razón pedagógica o técnica por la cual la IA se encuentra inhabilitada.
 *
 *     ErrorDetalleItem:
 *       type: object
 *       required:
 *         - idError
 *         - ejercicioPlantillaId
 *         - tipoError
 *         - detalle
 *         - comentarioDocente
 *       properties:
 *         idError:
 *           type: integer
 *           nullable: true
 *           example: 14
 *         ejercicioPlantillaId:
 *           type: integer
 *           example: 1
 *         tipoError:
 *           type: string
 *           example: "IMPORTE_INCORRECTO"
 *         detalle:
 *           type: object
 *           example:
 *             numeroAsiento: 1
 *             celda: "debe"
 *             valorEsperado: 1000
 *             valorIngresado: 10001
 *         comentarioDocente:
 *           type: string
 *           nullable: true
 *           example: "Verificar la suma de la cuenta Caja."
 *
 *     PlantillaEspacioTrabajo:
 *       type: object
 *       required:
 *         - idEjercicioPlantilla
 *         - tipo
 *         - nombre
 *         - estadoRevision
 *         - estadoAlumno
 *         - contenidoAlumno
 *         - contenidoDocente
 *         - errores
 *       properties:
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           example: "LIBRO_DIARIO"
 *         nombre:
 *           type: string
 *           example: "Libro diario"
 *         estadoRevision:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - CORREGIDA
 *           example: "PENDIENTE"
 *         estadoAlumno:
 *           type: string
 *           example: "COMPLETADA"
 *         contenidoAlumno:
 *           type: object
 *           nullable: true
 *         contenidoDocente:
 *           type: object
 *           nullable: true
 *         errores:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ErrorDetalleItem'
 *
 *     EspacioTrabajoCorreccionResponse:
 *       type: object
 *       required:
 *         - alumno
 *         - entrega
 *         - ejercicio
 *         - kpis
 *         - controlIa
 *         - retroalimentacionBorrador
 *         - plantillas
 *       properties:
 *         alumno:
 *           type: object
 *           required:
 *             - idAlumno
 *             - nombre
 *             - apellido
 *             - email
 *             - curso
 *           properties:
 *             idAlumno:
 *               type: string
 *               example: "alu-uuid-1"
 *             nombre:
 *               type: string
 *               example: "Braian"
 *             apellido:
 *               type: string
 *               example: "Gómez"
 *             email:
 *               type: string
 *               example: "braian@alumno.abacontex.com"
 *             fotoPerfilUrl:
 *               type: string
 *               nullable: true
 *               example: null
 *             curso:
 *               type: object
 *               properties:
 *                 idCurso:
 *                   type: integer
 *                   example: 1
 *                 nombreCurso:
 *                   type: string
 *                   example: "6° II"
 *         entrega:
 *           type: object
 *           required:
 *             - idEntrega
 *             - fueraDeTermino
 *           properties:
 *             idEntrega:
 *               type: integer
 *               example: 4
 *             fechaEntrega:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               example: "2026-10-24T18:00:00.000Z"
 *             fueraDeTermino:
 *               type: boolean
 *               example: false
 *         ejercicio:
 *           type: object
 *           required:
 *             - idEjercicio
 *             - titulo
 *             - enunciado
 *             - fechaLimite
 *             - totalPlantillas
 *             - plantillasResueltas
 *             - tieneResolucionDocente
 *           properties:
 *             idEjercicio:
 *               type: integer
 *               example: 1
 *             titulo:
 *               type: string
 *               example: "Registración de Compras y Ventas"
 *             enunciado:
 *               type: string
 *               example: "Registrar..."
 *             indicaciones:
 *               type: string
 *               nullable: true
 *               example: null
 *             fechaLimite:
 *               type: string
 *               format: date-time
 *               example: "2026-10-25T23:59:59.000Z"
 *             totalPlantillas:
 *               type: integer
 *               example: 2
 *             plantillasResueltas:
 *               type: integer
 *               example: 2
 *             tieneResolucionDocente:
 *               type: boolean
 *               example: true
 *         kpis:
 *           $ref: '#/components/schemas/KpisCorreccion'
 *         controlIa:
 *           $ref: '#/components/schemas/ControlAsistenciaIa'
 *         retroalimentacionBorrador:
 *           type: string
 *           nullable: true
 *           example: "Revisar los importes de Caja."
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlantillaEspacioTrabajo'
 *
 *     RevisarPlantillaRequest:
 *       type: object
 *       required:
 *         - estado
 *       properties:
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - CORREGIDA
 *           example: "CORREGIDA"
 *
 *     RevisarPlantillaResponse:
 *       type: object
 *       required:
 *         - idCorreccionPlantilla
 *         - entregaId
 *         - ejercicioPlantillaId
 *         - estado
 *         - mensaje
 *       properties:
 *         idCorreccionPlantilla:
 *           type: integer
 *           example: 8
 *         entregaId:
 *           type: integer
 *           example: 4
 *         ejercicioPlantillaId:
 *           type: integer
 *           example: 1
 *         estado:
 *           type: string
 *           example: "CORREGIDA"
 *         mensaje:
 *           type: string
 *           example: "Estado de corrección de la plantilla actualizado a CORREGIDA."
 *
 *     GuardarBorradorCorreccionRequest:
 *       type: object
 *       properties:
 *         retroalimentacion:
 *           type: string
 *           maxLength: 500
 *           example: "Avance de devolución guardado."
 *
 *     GuardarBorradorCorreccionResponse:
 *       type: object
 *       required:
 *         - entregaId
 *         - retroalimentacion
 *         - mensaje
 *       properties:
 *         entregaId:
 *           type: integer
 *           example: 4
 *         retroalimentacion:
 *           type: string
 *           nullable: true
 *           example: "Avance de devolución guardado."
 *         mensaje:
 *           type: string
 *           example: "Borrador de retroalimentación guardado exitosamente."
 *
 *     GuardarComentarioErrorRequest:
 *       type: object
 *       required:
 *         - ejercicioPlantillaId
 *         - tipoError
 *         - detalle
 *       properties:
 *         idError:
 *           type: integer
 *           description: ID si ya estaba persistido en DB. Omitir si es un error nuevo.
 *           example: 12
 *         ejercicioPlantillaId:
 *           type: integer
 *           example: 1
 *         tipoError:
 *           type: string
 *           example: "IMPORTE_INCORRECTO"
 *         detalle:
 *           type: object
 *           example:
 *             numeroAsiento: 1
 *             celda: "debe"
 *         comentario:
 *           type: string
 *           maxLength: 255
 *           nullable: true
 *           example: "Revisar sumatoria de Debe y Haber."
 *
 *     GuardarComentarioErrorResponse:
 *       type: object
 *       required:
 *         - idError
 *         - entregaId
 *         - ejercicioPlantillaId
 *         - tipoError
 *         - comentarioDocente
 *         - mensaje
 *       properties:
 *         idError:
 *           type: integer
 *           example: 12
 *         entregaId:
 *           type: integer
 *           example: 4
 *         ejercicioPlantillaId:
 *           type: integer
 *           example: 1
 *         tipoError:
 *           type: string
 *           example: "IMPORTE_INCORRECTO"
 *         comentarioDocente:
 *           type: string
 *           nullable: true
 *           example: "Revisar sumatoria de Debe y Haber."
 *         mensaje:
 *           type: string
 *           example: "Comentario guardado exitosamente."
 *
 *     SugerirRetroalimentacionIaResponse:
 *       type: object
 *       required:
 *         - sugerencia
 *         - erroresAnalizados
 *         - modeloUtilizado
 *       properties:
 *         sugerencia:
 *           type: string
 *           example: "Revisá bien las sumas del Debe y del Haber en la cuenta Caja..."
 *           description: Devolución pedagógica en tono docente argentino voseo (máx. 500 caracteres).
 *         erroresAnalizados:
 *           type: integer
 *           example: 4
 *         modeloUtilizado:
 *           type: string
 *           example: "llama-3.3-70b-versatile"
 *
 *     FinalizarCorreccionRequest:
 *       type: object
 *       properties:
 *         retroalimentacion:
 *           type: string
 *           maxLength: 500
 *           example: "Revisá bien las sumas del Debe y del Haber..."
 *
 *     FinalizarCorreccionResponse:
 *       type: object
 *       required:
 *         - idCorreccion
 *         - entregaId
 *         - fechaCorreccion
 *         - retroalimentacion
 *         - totalErrores
 *         - mensaje
 *       properties:
 *         idCorreccion:
 *           type: integer
 *           example: 4
 *         entregaId:
 *           type: integer
 *           example: 4
 *         fechaCorreccion:
 *           type: string
 *           format: date-time
 *           example: "2026-10-26T20:43:18.000Z"
 *         retroalimentacion:
 *           type: string
 *           nullable: true
 *           example: "Revisá bien las sumas del Debe y del Haber..."
 *         totalErrores:
 *           type: integer
 *           example: 4
 *         mensaje:
 *           type: string
 *           example: "La corrección ha sido enviada y notificada al alumno exitosamente."
 *
 *     KpisAnalisisErroresCurso:
 *       type: object
 *       required:
 *         - entregasAnalizadas
 *         - errorMasFrecuente
 *         - alumnosAfectados
 *         - plantillaConMasErrores
 *       properties:
 *         entregasAnalizadas:
 *           type: integer
 *           example: 24
 *         errorMasFrecuente:
 *           type: string
 *           example: "Desbalance Debe / Haber"
 *         alumnosAfectados:
 *           type: integer
 *           example: 15
 *         plantillaConMasErrores:
 *           type: string
 *           example: "Libro Diario"
 *
 *     ErrorFrecuenteCurso:
 *       type: object
 *       required:
 *         - tipoError
 *         - label
 *         - porcentaje
 *         - cantidadEntregasAfectadas
 *       properties:
 *         tipoError:
 *           type: string
 *           example: "DESBALANCE_ASIENTO"
 *         label:
 *           type: string
 *           example: "Desbalance Debe / Haber"
 *         porcentaje:
 *           type: number
 *           example: 45.5
 *         cantidadEntregasAfectadas:
 *           type: integer
 *           example: 12
 *
 *     PatronDetectadoCurso:
 *       type: object
 *       required:
 *         - tipoError
 *         - label
 *         - ejerciciosAfectados
 *         - alumnosAfectados
 *       properties:
 *         tipoError:
 *           type: string
 *           example: "CALCULO_MONTO_INCORRECTO"
 *         label:
 *           type: string
 *           example: "Cálculo incorrecto de importes"
 *         ejerciciosAfectados:
 *           type: integer
 *           example: 3
 *         alumnosAfectados:
 *           type: integer
 *           example: 9
 *
 *     AlumnoMasAfectadoCurso:
 *       type: object
 *       required:
 *         - idAlumno
 *         - nombre
 *         - apellido
 *         - totalErrores
 *         - ejerciciosConErrores
 *       properties:
 *         idAlumno:
 *           type: string
 *           example: "clx98234jksd9283"
 *         nombre:
 *           type: string
 *           example: "Lucía"
 *         apellido:
 *           type: string
 *           example: "Gómez"
 *         totalErrores:
 *           type: integer
 *           example: 14
 *         ejerciciosConErrores:
 *           type: integer
 *           example: 4
 *
 *     DistribucionPlantillaCurso:
 *       type: object
 *       required:
 *         - categoria
 *         - label
 *         - cantidadErrores
 *         - porcentaje
 *       properties:
 *         categoria:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - HOJA_TRABAJO
 *             - IVA
 *           example: "LIBRO_DIARIO"
 *         label:
 *           type: string
 *           example: "Libro Diario"
 *         cantidadErrores:
 *           type: integer
 *           example: 28
 *         porcentaje:
 *           type: number
 *           example: 65.2
 *
 *     DiagnosticoIaCurso:
 *       type: object
 *       required:
 *         - resumen
 *         - cosasAReforzar
 *         - fechaGeneracion
 *         - puedeGenerar
 *         - motivoDeshabilitado
 *       properties:
 *         resumen:
 *           type: string
 *           example: "El curso muestra buen dominio de las cuentas de activo pero presenta dificultades recurrentes en la partida doble..."
 *         cosasAReforzar:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "Reforzar la regla de partida doble en asientos de compras con descuentos."
 *             - "Repasar cálculo y saldo de IVA Débito y Crédito Fiscal."
 *         fechaGeneracion:
 *           type: string
 *           format: date-time
 *           example: "2026-10-26T18:30:00.000Z"
 *         puedeGenerar:
 *           type: boolean
 *           example: false
 *         motivoDeshabilitado:
 *           type: string
 *           nullable: true
 *           example: "El diagnóstico actual se encuentra vigente. No se detectaron cambios en la tendencia de errores del curso."
 *
 *     DiagnosticoIaControl:
 *       type: object
 *       required:
 *         - puedeGenerar
 *         - motivoDeshabilitado
 *       properties:
 *         puedeGenerar:
 *           type: boolean
 *           example: true
 *         motivoDeshabilitado:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     AnalisisErroresCursoResponse:
 *       type: object
 *       required:
 *         - curso
 *         - kpis
 *         - erroresFrecuentes
 *         - patronesDetectados
 *         - alumnosMasAfectados
 *         - distribucionPlantillas
 *         - diagnosticoIa
 *         - controlIa
 *       properties:
 *         curso:
 *           type: object
 *           required:
 *             - idCurso
 *             - nombreCurso
 *             - año
 *           properties:
 *             idCurso:
 *               type: integer
 *               example: 1
 *             nombreCurso:
 *               type: string
 *               example: "5° I"
 *             año:
 *               type: integer
 *               example: 2026
 *         kpis:
 *           $ref: '#/components/schemas/KpisAnalisisErroresCurso'
 *         erroresFrecuentes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ErrorFrecuenteCurso'
 *         patronesDetectados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PatronDetectadoCurso'
 *         alumnosMasAfectados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AlumnoMasAfectadoCurso'
 *         distribucionPlantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DistribucionPlantillaCurso'
 *         diagnosticoIa:
 *           allOf:
 *             - $ref: '#/components/schemas/DiagnosticoIaCurso'
 *           nullable: true
 *         controlIa:
 *           $ref: '#/components/schemas/DiagnosticoIaControl'
 */
