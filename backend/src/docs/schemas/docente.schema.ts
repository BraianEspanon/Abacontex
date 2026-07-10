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
 */
