/**
 * @openapi
 * components:
 *   schemas:
 *     DocenteCrearRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - password
 *         - cursoIds
 *       properties:
 *         nombre:
 *           type: string
 *           example: María
 *         apellido:
 *           type: string
 *           example: López
 *         email:
 *           type: string
 *           format: email
 *           example: maria.lopez@abacontex.com
 *         password:
 *           type: string
 *           format: password
 *           example: MiPassword123
 *         cursoIds:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: integer
 *           example:
 *             - 1
 *             - 2
 *
 *     DocenteActualizarCursosRequest:
 *       type: object
 *       required:
 *         - cursoIds
 *       properties:
 *         cursoIds:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: integer
 *           example:
 *             - 1
 *             - 2
 *
 *     DocenteCreado:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *         keycloakId:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         email:
 *           type: string
 *           format: email
 *           example: maria.lopez@abacontex.com
 *         nombre:
 *           type: string
 *           example: María
 *         apellido:
 *           type: string
 *           example: López
 *         rolSistemaId:
 *           type: integer
 *           example: 2
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         fechaAlta:
 *           type: string
 *           format: date-time
 *           example: 2026-07-10T00:00:00.000Z
 *
 *     DocenteActual:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 60c6d9ad-9039-4338-8846-2479f74ff4ce
 *         nombre:
 *           type: string
 *           example: María
 *         apellido:
 *           type: string
 *           example: López
 *         email:
 *           type: string
 *           format: email
 *           example: maria.lopez@abacontex.com
 *         cursos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: 5to Año A
 *
 *     DashboardDocente:
 *       type: object
 *       properties:
 *         resumen:
 *           type: object
 *           properties:
 *             cursosActivos:
 *               type: integer
 *               example: 0
 *             empresasActivas:
 *               type: integer
 *               example: 0
 *             alumnos:
 *               type: integer
 *               example: 0
 *             ejerciciosPendientes:
 *               type: integer
 *               example: 0
 *             puntajePromedio:
 *               type: number
 *               nullable: true
 *               example: null
 *         actividadReciente:
 *           type: array
 *           items:
 *             type: object
 *         alumnosRiesgo:
 *           type: array
 *           items:
 *             type: object
 *         ranking:
 *           type: array
 *           items:
 *             type: object
 *         participacion:
 *           type: array
 *           items:
 *             type: object
 *         correcciones:
 *           type: array
 *           items:
 *             type: object
 *         alertas:
 *           type: array
 *           items:
 *             type: object
 *
 *     CursoDocente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: 5to Año A
 *         empresasActivas:
 *           type: integer
 *           example: 3
 *         alumnos:
 *           type: integer
 *           example: 18
 *         participacionPromedio:
 *           type: number
 *           nullable: true
 *           example: null
 *         puntajePromedioEmpresarial:
 *           type: number
 *           nullable: true
 *           example: null
 *         ultimaActividad:
 *           type: object
 *           nullable: true
 *           properties:
 *             fecha:
 *               type: string
 *               format: date-time
 *               example: 2026-07-10T10:30:00.000Z
 *             descripcion:
 *               type: string
 *               example: Empresa actualizada
 *             empresa:
 *               type: string
 *               example: Abacontex S.A.
 *
 *     ResumenEmpresasDocente:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 12
 *         activas:
 *           type: integer
 *           nullable: true
 *           example: null
 *         inactivas:
 *           type: integer
 *           nullable: true
 *           example: null
 *
 *     EmpresaDocente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         nombre:
 *           type: string
 *           example: Abacontex S.A.
 *         actividad:
 *           type: string
 *           example: Software
 *         logoUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         activa:
 *           type: boolean
 *           nullable: true
 *           example: null
 *         idCurso:
 *           type: integer
 *           example: 1
 *         curso:
 *           type: string
 *           example: 5to Año A
 *         cantidadIntegrantes:
 *           type: integer
 *           example: 4
 *         contactos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - juan.perez@abacontex.com
 *             - maria.gomez@abacontex.com
 *
 *     IntegranteEmpresaDocente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 8f2374c4-4a74-4cfe-97ef-c1d7e85e967f
 *         nombre:
 *           type: string
 *           example: Juan
 *         apellido:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@abacontex.com
 *         rolEmpresa:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     EmpresaDocenteDetalle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         nombre:
 *           type: string
 *           example: Abacontex S.A.
 *         actividad:
 *           type: string
 *           example: Software
 *         logoUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         activa:
 *           type: boolean
 *           nullable: true
 *           example: null
 *         idCurso:
 *           type: integer
 *           example: 1
 *         curso:
 *           type: string
 *           example: 5to Año A
 *         fechaCreacion:
 *           type: string
 *           nullable: true
 *           example: null
 *         cantidadIntegrantes:
 *           type: integer
 *           example: 4
 *         contactos:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - juan.perez@abacontex.com
 *             - maria.gomez@abacontex.com
 *         integrantes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IntegranteEmpresaDocente'
 *
 *     EmpresasDocenteResponse:
 *       type: object
 *       properties:
 *         resumen:
 *           $ref: '#/components/schemas/ResumenEmpresasDocente'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmpresaDocente'
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 12
 *         totalPages:
 *           type: integer
 *           example: 2
 *
 *     AlumnoDocente:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: c34f4f5e-2b7f-4da8-bc3b-f7317d62f4d8
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *           example: null
 *         nombre:
 *           type: string
 *           example: Ana
 *         apellido:
 *           type: string
 *           example: García
 *         email:
 *           type: string
 *           format: email
 *           example: ana.garcia@abacontex.com
 *         curso:
 *           type: string
 *           example: 5to Año A
 *         empresa:
 *           type: string
 *           nullable: true
 *           example: null
 *         participacion:
 *           type: number
 *           nullable: true
 *           example: null
 *         ejerciciosRealizados:
 *           type: integer
 *           nullable: true
 *           example: null
 *         ultimaActividad:
 *           type: string
 *           nullable: true
 *           example: null
 *         estado:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     AlumnosDocenteResponse:
 *       type: object
 *       properties:
 *         resumen:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 24
 *             activos:
 *               type: integer
 *               nullable: true
 *               example: null
 *             enRiesgo:
 *               type: integer
 *               nullable: true
 *               example: null
 *             tareasPendientes:
 *               type: integer
 *               nullable: true
 *               example: null
 *             promedioGeneral:
 *               type: number
 *               nullable: true
 *               example: null
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AlumnoDocente'
 *         totalItems:
 *           type: integer
 *           example: 24
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 3
 */
