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
 */
