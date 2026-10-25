/**
 * @openapi
 * components:
 *   schemas:
 *     EmpresaCrearRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - actividad
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: Abacontex S.A.
 *           description: Nombre de la empresa.
 *
 *         actividad:
 *           type: string
 *           maxLength: 255
 *           example: Desarrollo de software
 *           description: Actividad económica o descripción de la empresa.
 *
 *         logo:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen para el logo de la empresa. Formatos permitidos JPG, PNG y WEBP. Tamaño máximo 5 MB.
 *
 *     EmpresaCreada:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: Abacontex S.A.
 *         actividad:
 *           type: string
 *           example: Desarrollo de software
 *         logoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/logo.png
 *         puntos:
 *           type: integer
 *           example: 0
 *         idCurso:
 *           type: integer
 *           example: 1
 *         idCicloLectivo:
 *           type: integer
 *           example: 1
 *
 *     EmpresaActualizarRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - actividad
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: Abacontex S.A.
 *
 *         actividad:
 *           type: string
 *           maxLength: 255
 *           example: Desarrollo de software
 *
 *         logo:
 *           type: string
 *           format: binary
 *           description: Nuevo archivo de imagen para reemplazar el logo actual. Formatos permitidos JPG, PNG y WEBP. Tamaño máximo 5 MB.
 *
 *         eliminarLogo:
 *           type: boolean
 *           example: false
 *           description: Si es true, elimina el logo actual sin reemplazarlo por uno nuevo.
 *
 *     EmpresaActual:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *
 *         nombre:
 *           type: string
 *           example: Abacontex S.A.
 *
 *         actividad:
 *           type: string
 *           example: Desarrollo de software
 *
 *         logoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/logo.png
 *
 *         puntos:
 *           type: integer
 *           example: 0
 *
 *         curso:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: 5to Año A
 *
 *         cicloLectivo:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: integer
 *               example: 2025
 *
 *         integrantes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@abacontex.com
 *               rolEmpresa:
 *                 nullable: true
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   nombre:
 *                     type: string
 *                     example: COO
 *
 *     CandidatoEmpresa:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *
 *         nombre:
 *           type: string
 *           example: Juan
 *
 *         apellido:
 *           type: string
 *           example: Pérez
 *
 *         email:
 *           type: string
 *           format: email
 *           example: juan@abacontex.com
 *
 *         rolEmpresa:
 *           nullable: true
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             nombre:
 *               type: string
 *               example: COO
 *
 *     ParticipantesRequest:
 *       type: object
 *       required:
 *         - participantes
 *       properties:
 *         participantes:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *             format: uuid
 *           example:
 *             - 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *             - 42c6d9ad-9039-4338-8846-2488f74ff4ee
 *
 *     CambiarRolParticipanteRequest:
 *       type: object
 *       required:
 *         - idRolEmpresa
 *       properties:
 *         idRolEmpresa:
 *           type: integer
 *           example: 2
 *           description: Identificador del nuevo rol empresarial.
 *
 *     ModificarRolesEmpresaRequest:
 *       type: object
 *       required:
 *         - roles
 *       properties:
 *         roles:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - idAlumno
 *               - idRolEmpresa
 *             properties:
 *               idAlumno:
 *                 type: string
 *                 format: uuid
 *                 example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *
 *               idRolEmpresa:
 *                 type: integer
 *                 example: 2
 *
 *     CrearInvitacionesRequest:
 *       type: object
 *       required:
 *         - emails
 *       properties:
 *         emails:
 *           type: array
 *           minItems: 1
 *           maxItems: 10
 *           items:
 *             type: string
 *             format: email
 *           example:
 *             - juan@example.com
 *             - maria@example.com
 *
 *     InvitacionEmpresa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         empresaId:
 *           type: integer
 *           example: 3
 *         email:
 *           type: string
 *           format: email
 *           example: juan@example.com
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         fechaExpiracion:
 *           type: string
 *           format: date-time
 *           example: 2026-07-23T10:30:00.000Z
 *
 *     EmpresaInfoDashboard:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - actividad
 *         - activo
 *         - cantidadIntegrantes
 *         - limiteIntegrantes
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: Abacontex S.A.
 *         actividad:
 *           type: string
 *           example: Desarrollo de software
 *         logoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/logo.png
 *         activo:
 *           type: boolean
 *           example: true
 *         cantidadIntegrantes:
 *           type: integer
 *           example: 4
 *         limiteIntegrantes:
 *           type: integer
 *           example: 7
 *         posicionRanking:
 *           type: integer
 *           nullable: true
 *           example: null
 *         totalEmpresas:
 *           type: integer
 *           nullable: true
 *           example: null
 *         puntajeEmpresarial:
 *           type: number
 *           nullable: true
 *           example: null
 *
 *     FinanzasDashboard:
 *       type: object
 *       required:
 *         - cajaDisponible
 *         - variacionCajaPorcentaje
 *         - ingresosAcumulados
 *         - variacionIngresosPorcentaje
 *         - egresosAcumulados
 *         - variacionEgresosPorcentaje
 *         - resultadoAcumulado
 *         - variacionResultadoPorcentaje
 *       properties:
 *         cajaDisponible:
 *           type: number
 *           example: 125000.5
 *         variacionCajaPorcentaje:
 *           type: number
 *           example: 12.5
 *         ingresosAcumulados:
 *           type: number
 *           example: 450000
 *         variacionIngresosPorcentaje:
 *           type: number
 *           example: 8.3
 *         egresosAcumulados:
 *           type: number
 *           example: 324999.5
 *         variacionEgresosPorcentaje:
 *           type: number
 *           example: -5.2
 *         resultadoAcumulado:
 *           type: number
 *           example: 125000.5
 *         variacionResultadoPorcentaje:
 *           type: number
 *           example: 15.0
 *
 *     EvolucionPuntoGrafico:
 *       type: object
 *       required:
 *         - periodo
 *         - ingresos
 *         - egresos
 *         - resultado
 *       properties:
 *         periodo:
 *           type: string
 *           example: Sem 1
 *         ingresos:
 *           type: number
 *           example: 150000
 *         egresos:
 *           type: number
 *           example: 80000
 *         resultado:
 *           type: number
 *           example: 70000
 *
 *     GraficoEvolucionFinanciera:
 *       type: object
 *       required:
 *         - ultimoMes
 *         - tresMeses
 *         - cicloLectivo
 *       properties:
 *         ultimoMes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EvolucionPuntoGrafico'
 *         tresMeses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EvolucionPuntoGrafico'
 *         cicloLectivo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EvolucionPuntoGrafico'
 *
 *     ActividadPendienteDashboard:
 *       type: object
 *       required:
 *         - pedidosPendientes
 *         - pedidosListosParaEntregar
 *         - facturasPendientes
 *         - asientosContablesPendientes
 *         - ejerciciosSinResolver
 *         - ordenesProduccionPendientes
 *       properties:
 *         pedidosPendientes:
 *           type: integer
 *           example: 3
 *         pedidosListosParaEntregar:
 *           type: integer
 *           example: 1
 *         facturasPendientes:
 *           type: integer
 *           example: 2
 *         asientosContablesPendientes:
 *           type: integer
 *           example: 4
 *         ejerciciosSinResolver:
 *           type: integer
 *           example: 2
 *         simulacionesPendientes:
 *           type: integer
 *           nullable: true
 *           example: 0
 *         ordenesProduccionPendientes:
 *           type: integer
 *           example: 1
 *
 *     IndicadoresNegocioDashboard:
 *       type: object
 *       required:
 *         - ventasRealizadas
 *         - pedidosCompletados
 *         - pedidosRecibidos
 *         - pedidosConFaltante
 *         - ordenesCompletadas
 *         - ordenesTotales
 *         - rentabilidadPorcentaje
 *       properties:
 *         ventasRealizadas:
 *           type: integer
 *           example: 12
 *         pedidosCompletados:
 *           type: integer
 *           example: 10
 *         pedidosRecibidos:
 *           type: integer
 *           example: 15
 *         pedidosConFaltante:
 *           type: integer
 *           example: 2
 *         precisionContable:
 *           type: number
 *           nullable: true
 *           example: null
 *         ordenesCompletadas:
 *           type: integer
 *           example: 5
 *         ordenesTotales:
 *           type: integer
 *           example: 6
 *         rentabilidadPorcentaje:
 *           type: number
 *           example: 27.8
 *
 *     MiembroEquipoDashboard:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - apellido
 *         - email
 *         - esUsuarioActual
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *         nombre:
 *           type: string
 *           example: Juan
 *         apellido:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan@abacontex.com
 *         rolEmpresa:
 *           type: object
 *           nullable: true
 *           properties:
 *             idRol:
 *               type: integer
 *               example: 2
 *             nombreRol:
 *               type: string
 *               example: COO
 *         esUsuarioActual:
 *           type: boolean
 *           example: true
 *
 *     InvitacionPendienteDashboard:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - createdAt
 *         - fechaExpiracion
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         email:
 *           type: string
 *           format: email
 *           example: carlos@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-20T10:30:00.000Z
 *         fechaExpiracion:
 *           type: string
 *           format: date-time
 *           example: 2026-07-23T10:30:00.000Z
 *
 *     EquipoDashboard:
 *       type: object
 *       required:
 *         - miembros
 *         - invitacionesPendientes
 *       properties:
 *         miembros:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MiembroEquipoDashboard'
 *         invitacionesPendientes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvitacionPendienteDashboard'
 *
 *     DesempenoDashboard:
 *       type: object
 *       nullable: true
 *       properties:
 *         posicionRanking:
 *           type: integer
 *           nullable: true
 *           example: null
 *         totalEmpresas:
 *           type: integer
 *           nullable: true
 *           example: null
 *         puntajeTotal:
 *           type: number
 *           nullable: true
 *           example: null
 *         desgloseDimensiones:
 *           type: object
 *           nullable: true
 *           properties:
 *             comercial:
 *               type: number
 *               nullable: true
 *               example: null
 *             operativo:
 *               type: number
 *               nullable: true
 *               example: null
 *             contable:
 *               type: number
 *               nullable: true
 *               example: null
 *
 *     RankingItemDashboard:
 *       type: object
 *       required:
 *         - posicion
 *         - nombreEmpresa
 *         - puntaje
 *         - esEmpresaActual
 *       properties:
 *         posicion:
 *           type: integer
 *           example: 1
 *         nombreEmpresa:
 *           type: string
 *           example: Distribuidora Norte S.A.
 *         puntaje:
 *           type: number
 *           example: 850
 *         esEmpresaActual:
 *           type: boolean
 *           example: false
 *
 *     RankingDashboard:
 *       type: object
 *       nullable: true
 *       properties:
 *         posicionActual:
 *           type: integer
 *           nullable: true
 *           example: null
 *         totalEmpresas:
 *           type: integer
 *           nullable: true
 *           example: null
 *         top:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RankingItemDashboard'
 *
 *     LogroItemDashboard:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - descripcion
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Primera Venta
 *         descripcion:
 *           type: string
 *           example: Concretar y facturar la primera venta comercial.
 *
 *     ObjetivoItemDashboard:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - descripcion
 *         - progreso
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         nombre:
 *           type: string
 *           example: Alcanzar 10 Ventas
 *         descripcion:
 *           type: string
 *           example: Completar 10 pedidos facturados con cobranza.
 *         progreso:
 *           type: number
 *           example: 60
 *
 *     LogrosDashboard:
 *       type: object
 *       nullable: true
 *       properties:
 *         logrosDesbloqueados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LogroItemDashboard'
 *         proximosObjetivos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ObjetivoItemDashboard'
 *
 *     EmpresaDashboardResponse:
 *       type: object
 *       required:
 *         - empresa
 *         - finanzas
 *         - graficoEvolucion
 *         - actividadPendiente
 *         - indicadoresNegocio
 *         - equipo
 *       properties:
 *         empresa:
 *           $ref: '#/components/schemas/EmpresaInfoDashboard'
 *         finanzas:
 *           $ref: '#/components/schemas/FinanzasDashboard'
 *         graficoEvolucion:
 *           $ref: '#/components/schemas/GraficoEvolucionFinanciera'
 *         actividadPendiente:
 *           $ref: '#/components/schemas/ActividadPendienteDashboard'
 *         indicadoresNegocio:
 *           $ref: '#/components/schemas/IndicadoresNegocioDashboard'
 *         equipo:
 *           $ref: '#/components/schemas/EquipoDashboard'
 *         desempeno:
 *           $ref: '#/components/schemas/DesempenoDashboard'
 *         ranking:
 *           $ref: '#/components/schemas/RankingDashboard'
 *         logros:
 *           $ref: '#/components/schemas/LogrosDashboard'
 */
