/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CompletarRegistroRequest:
 *       type: object
 *       required:
 *         - idCurso
 *         - idRolEmpresa
 *       properties:
 *         idCurso:
 *           type: integer
 *           example: 1
 *           description: |
 *              Identificador del curso del alumno.
 *              Se recomienda enviarlo como integer.
 *
 *         idRolEmpresa:
 *           type: integer
 *           example: 2
 *           description: |
 *               Identificador del rol empresarial.
 *               Se recomienda enviarlo como integer.
 *
 *     AlumnoActual:
 *       type: object
 *       properties:
 *         registroCompleto:
 *           type: boolean
 *           example: true
 *
 *         id:
 *           type: string
 *           format: uuid
 *           example: "60c6d9ad-9039-4338-8846-2479f74ff4ce"
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
 *         curso:
 *           nullable: true
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nombre:
 *               type: string
 *               example: 5to Año A
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
 *         empresa:
 *           nullable: true
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             nombre:
 *               type: string
 *               example: Abacontex S.A.
 */
