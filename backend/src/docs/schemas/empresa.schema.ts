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
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: https://cdn.example.com/logo.png
 *           description: URL del logo de la empresa. Opcional.
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
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: https://cdn.example.com/logo.png
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
 */
