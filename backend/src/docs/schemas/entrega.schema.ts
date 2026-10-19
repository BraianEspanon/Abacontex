/**
 * @openapi
 * components:
 *   schemas:
 *     DocenteResumenEntrega:
 *       type: object
 *       required:
 *         - idDocente
 *         - nombre
 *         - apellido
 *       properties:
 *         idDocente:
 *           type: string
 *           example: "auth0|64b9a1c2d3e4f5a6b7c8d9e0"
 *           description: ID único del docente.
 *         nombre:
 *           type: string
 *           example: "Juan"
 *           description: Nombre del docente.
 *         apellido:
 *           type: string
 *           example: "Pérez"
 *           description: Apellido del docente.
 *
 *     CursoResumenEntrega:
 *       type: object
 *       required:
 *         - idCurso
 *         - nombreCurso
 *         - año
 *       properties:
 *         idCurso:
 *           type: integer
 *           example: 1
 *           description: ID único del curso.
 *         nombreCurso:
 *           type: string
 *           example: "5° B - Contabilidad II"
 *           description: Nombre o denominación del curso.
 *         año:
 *           type: integer
 *           example: 2026
 *           description: Año lectivo del curso.
 *
 *     CorreccionResumenEntrega:
 *       type: object
 *       required:
 *         - estado
 *         - fechaCorreccion
 *       properties:
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_REVISION
 *             - CORREGIDO
 *           example: "PENDIENTE"
 *           description: Estado de la corrección docente.
 *         fechaCorreccion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *           description: Fecha y hora en que el docente corrigió la entrega (o null si está pendiente).
 *
 *     ItemTableroEntrega:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - docente
 *         - fechaLimite
 *         - totalPlantillas
 *         - plantillasCompletadas
 *         - estado
 *         - bloqueado
 *         - fechaEntrega
 *         - correccion
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *           description: ID numérico del ejercicio.
 *         titulo:
 *           type: string
 *           example: "Ejercicio 1 - Asientos y Mayorización"
 *           description: Título del ejercicio.
 *         docente:
 *           $ref: '#/components/schemas/DocenteResumenEntrega'
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-11-01T23:59:59.000Z"
 *           description: Fecha límite de entrega establecida por el docente.
 *         totalPlantillas:
 *           type: integer
 *           example: 3
 *           description: Total de plantillas habilitadas en el ejercicio.
 *         plantillasCompletadas:
 *           type: integer
 *           example: 1
 *           description: Cantidad de plantillas marcadas como COMPLETADA por el alumno.
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_PROGRESO
 *             - ENTREGADO
 *             - CORREGIDO
 *             - VENCIDO
 *           example: "EN_PROGRESO"
 *           description: Estado dinámico del ejercicio para el alumno autenticado.
 *         bloqueado:
 *           type: boolean
 *           example: false
 *           description: Indica si el ejercicio ya fue entregado formalmente y bloquea la edición.
 *         fechaEntrega:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *           description: Fecha y hora en que el alumno finalizó la entrega.
 *         correccion:
 *           $ref: '#/components/schemas/CorreccionResumenEntrega'
 *           nullable: true
 *
 *     ResumenTableroEntregas:
 *       type: object
 *       required:
 *         - total
 *         - pendientes
 *         - enProgreso
 *         - entregados
 *         - corregidos
 *         - vencidos
 *       properties:
 *         total:
 *           type: integer
 *           example: 12
 *           description: Total de ejercicios publicados disponibles para el alumno.
 *         pendientes:
 *           type: integer
 *           example: 4
 *           description: Ejercicios sin avances iniciados.
 *         enProgreso:
 *           type: integer
 *           example: 3
 *           description: Ejercicios con plantillas en edición o completadas parcialmente.
 *         entregados:
 *           type: integer
 *           example: 2
 *           description: Ejercicios entregados a la espera de corrección.
 *         corregidos:
 *           type: integer
 *           example: 2
 *           description: Ejercicios con corrección docente disponible.
 *         vencidos:
 *           type: integer
 *           example: 1
 *           description: Ejercicios cuya fecha límite expiró sin haberse entregado.
 *
 *     ListadoEntregasAlumnoResponse:
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
 *             $ref: '#/components/schemas/ItemTableroEntrega'
 *         page:
 *           type: integer
 *           example: 1
 *           description: Número de página actual.
 *         pageSize:
 *           type: integer
 *           example: 6
 *           description: Tamaño de página (cantidad de elementos por página).
 *         totalItems:
 *           type: integer
 *           example: 12
 *           description: Cantidad total de elementos filtrados.
 *         totalPages:
 *           type: integer
 *           example: 2
 *           description: Cantidad total de páginas disponibles.
 *         resumen:
 *           $ref: '#/components/schemas/ResumenTableroEntregas'
 *
 *     OpcionFiltroEstado:
 *       type: object
 *       required:
 *         - clave
 *         - label
 *       properties:
 *         clave:
 *           type: string
 *           enum:
 *             - TODAS
 *             - PENDIENTE
 *             - EN_PROGRESO
 *             - ENTREGADO
 *             - CORREGIDO
 *             - VENCIDO
 *           example: "PENDIENTE"
 *           description: Clave del estado para enviar en la query `estado`.
 *         label:
 *           type: string
 *           example: "Pendientes"
 *           description: Etiqueta descriptiva para visualización en la UI.
 *
 *     OpcionesFiltrosEntregaResponse:
 *       type: object
 *       required:
 *         - docentes
 *         - estados
 *       properties:
 *         docentes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DocenteResumenEntrega'
 *           description: Lista de docentes que dictan o han creado ejercicios en el curso del alumno.
 *         estados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OpcionFiltroEstado'
 *           description: Opciones de filtrado por estado con labels legibles.
 *
 *     PlantillaDetalleResumen:
 *       type: object
 *       required:
 *         - idEjercicioPlantilla
 *         - tipo
 *         - estado
 *       properties:
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 10
 *           description: ID único de la plantilla en el ejercicio.
 *         tipo:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *             - HOJA_TRABAJO
 *           example: "LIBRO_DIARIO"
 *           description: Tipo de libro o formato contable.
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_EDICION
 *             - COMPLETADA
 *           example: "COMPLETADA"
 *           description: Estado de resolución alcanzado por el alumno en esta plantilla.
 *
 *     DetalleEjercicioAlumnoResponse:
 *       type: object
 *       required:
 *         - idEjercicio
 *         - titulo
 *         - enunciado
 *         - indicaciones
 *         - fechaLimite
 *         - estado
 *         - bloqueado
 *         - fechaEntrega
 *         - curso
 *         - docente
 *         - totalPlantillas
 *         - plantillasCompletadas
 *         - plantillas
 *         - correccion
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Ejercicio 1 - Asientos y Mayorización"
 *         enunciado:
 *           type: string
 *           example: "Registrar las operaciones en Libro Diario y mayorizar en cuentas T."
 *         indicaciones:
 *           type: string
 *           nullable: true
 *           example: "Recordar calcular IVA 21% en compras y ventas."
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-11-01T23:59:59.000Z"
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_PROGRESO
 *             - ENTREGADO
 *             - CORREGIDO
 *             - VENCIDO
 *           example: "EN_PROGRESO"
 *         bloqueado:
 *           type: boolean
 *           example: false
 *           description: True si el ejercicio ya fue entregado y no permite más cambios.
 *         fechaEntrega:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         curso:
 *           $ref: '#/components/schemas/CursoResumenEntrega'
 *         docente:
 *           $ref: '#/components/schemas/DocenteResumenEntrega'
 *         totalPlantillas:
 *           type: integer
 *           example: 2
 *         plantillasCompletadas:
 *           type: integer
 *           example: 1
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlantillaDetalleResumen'
 *         correccion:
 *           $ref: '#/components/schemas/CorreccionResumenEntrega'
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-16T12:00:00.000Z"
 *
 *     ResolucionAlumnoPlantillaItem:
 *       type: object
 *       required:
 *         - idEjercicioPlantilla
 *         - tipo
 *         - estado
 *         - contenido
 *       properties:
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 10
 *         tipo:
 *           type: string
 *           enum:
 *             - LIBRO_DIARIO
 *             - LIBRO_MAYOR
 *             - LIBRO_IVA
 *             - HOJA_TRABAJO
 *           example: "LIBRO_DIARIO"
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_EDICION
 *             - COMPLETADA
 *           example: "EN_EDICION"
 *         contenido:
 *           type: object
 *           nullable: true
 *           description: JSON con la resolución de la plantilla cargada por el alumno (o null si aún no fue iniciada).
 *
 *     ResolucionAlumnoResponse:
 *       type: object
 *       required:
 *         - idEntrega
 *         - idEjercicio
 *         - titulo
 *         - enunciado
 *         - fechaLimite
 *         - bloqueado
 *         - fechaEntrega
 *         - estado
 *         - curso
 *         - plantillas
 *       properties:
 *         idEntrega:
 *           type: integer
 *           example: 5
 *           description: ID de la entrega asociada al par (ejercicio, alumno).
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Ejercicio 1 - Asientos y Mayorización"
 *         enunciado:
 *           type: string
 *           example: "Registrar las operaciones en Libro Diario y mayorizar en cuentas T."
 *         fechaLimite:
 *           type: string
 *           format: date-time
 *           example: "2026-11-01T23:59:59.000Z"
 *         bloqueado:
 *           type: boolean
 *           example: false
 *           description: True si la entrega ya fue enviada (modo solo lectura).
 *         fechaEntrega:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         estado:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - EN_PROGRESO
 *             - ENTREGADO
 *             - CORREGIDO
 *             - VENCIDO
 *           example: "EN_PROGRESO"
 *         curso:
 *           $ref: '#/components/schemas/CursoResumenEntrega'
 *         plantillas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResolucionAlumnoPlantillaItem'
 *
 *     GuardarPlantillaAlumnoRequest:
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
 *           example: "LIBRO_DIARIO"
 *           description: Tipo de plantilla contable a guardar.
 *         estado:
 *           type: string
 *           enum:
 *             - EN_EDICION
 *             - COMPLETADA
 *           default: "EN_EDICION"
 *           example: "EN_EDICION"
 *           description: Estado de avance asignado a la plantilla.
 *         contenido:
 *           description: Estructura JSON de la plantilla. Se valida consistencia estructural sin exigir balance perfecto para preservar el proceso pedagógico.
 *           oneOf:
 *             - $ref: '#/components/schemas/LibroDiarioContenidoRequest'
 *             - $ref: '#/components/schemas/LibroMayorContenidoRequest'
 *             - $ref: '#/components/schemas/LibroIvaContenidoRequest'
 *             - $ref: '#/components/schemas/HojaTrabajoContenidoRequest'
 *
 *     GuardarPlantillaAlumnoResponse:
 *       type: object
 *       required:
 *         - idResolucionPlantilla
 *         - idEjercicioPlantilla
 *         - tipo
 *         - estado
 *         - contenido
 *       properties:
 *         idResolucionPlantilla:
 *           type: integer
 *           example: 15
 *           description: ID de la resolución de la plantilla.
 *         idEjercicioPlantilla:
 *           type: integer
 *           example: 10
 *           description: ID de la plantilla del ejercicio.
 *         tipo:
 *           type: string
 *           example: "LIBRO_DIARIO"
 *         estado:
 *           type: string
 *           enum:
 *             - EN_EDICION
 *             - COMPLETADA
 *           example: "EN_EDICION"
 *         contenido:
 *           type: object
 *           nullable: true
 *           description: Contenido JSON persistido de la plantilla.
 *
 *     FinalizarEntregaAlumnoResponse:
 *       type: object
 *       required:
 *         - idEntrega
 *         - idEjercicio
 *         - mensaje
 *         - estado
 *         - bloqueado
 *         - fechaEntrega
 *         - fueraDeTermino
 *       properties:
 *         idEntrega:
 *           type: integer
 *           example: 5
 *           description: ID de la entrega del alumno.
 *         idEjercicio:
 *           type: integer
 *           example: 1
 *           description: ID del ejercicio entregado.
 *         mensaje:
 *           type: string
 *           example: "Ejercicio entregado exitosamente."
 *         estado:
 *           type: string
 *           enum:
 *             - ENTREGADO
 *           example: "ENTREGADO"
 *         bloqueado:
 *           type: boolean
 *           example: true
 *           description: Bloqueado queda en true inmediatamente al entregar.
 *         fechaEntrega:
 *           type: string
 *           format: date-time
 *           example: "2026-10-17T18:25:00.000Z"
 *           description: Marca temporal en que se registró la entrega formal.
 *         fueraDeTermino:
 *           type: boolean
 *           example: false
 *           description: Indica si la entrega se produjo después de la fecha límite establecida.
 */
