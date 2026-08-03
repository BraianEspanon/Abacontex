/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CompletarRegistroRequest:
 *       type: object
 *       required:
 *         - idRolEmpresa
 *       properties:
 *         idCurso:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: |
 *             Requerido solo para el flujo normal. No se envía en el flujo por invitación.
 *
 *         idRolEmpresa:
 *           type: integer
 *           example: 2
 *           description: |
 *             Identificador del rol empresarial seleccionado por el alumno.
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
 *             descripcion:
 *               type: string
 *               nullable: true
 *               example: Rol de empresa para coordinadores
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
 *
 *     CursoRegistro:
 *       type: object
 *       properties:
 *         idCurso:
 *           type: integer
 *           example: 2
 *         nombreCurso:
 *           type: string
 *           example: 6° A
 *
 *     RolEmpresaRegistro:
 *       type: object
 *       properties:
 *         idRol:
 *           type: integer
 *           example: 2
 *         nombreRol:
 *           type: string
 *           example: CTO
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: Rol de empresa para tecnología
 *
 *     RegistroNormalResponse:
 *       type: object
 *       required:
 *         - tipo
 *         - cursos
 *         - rolesEmpresa
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [NORMAL]
 *           example: NORMAL
 *         cursos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CursoRegistro'
 *         rolesEmpresa:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RolEmpresaRegistro'
 *
 *     RegistroInvitacionResponse:
 *       type: object
 *       required:
 *         - tipo
 *         - empresa
 *         - curso
 *         - rolesEmpresa
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [INVITACION]
 *           example: INVITACION
 *         empresa:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             nombre:
 *               type: string
 *               example: EcoHarmony
 *         curso:
 *           $ref: '#/components/schemas/CursoRegistro'
 *         rolesEmpresa:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RolEmpresaRegistro'
 *
 *     RegistroResponse:
 *       oneOf:
 *         - $ref: '#/components/schemas/RegistroNormalResponse'
 *         - $ref: '#/components/schemas/RegistroInvitacionResponse'
 *
 *     InvitacionAlumno:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 15
 *         empresaId:
 *           type: integer
 *           example: 3
 *         email:
 *           type: string
 *           format: email
 *           example: juan@example.com
 *         token:
 *           type: string
 *           example: 9b6d613d9a0f
 *         estado:
 *           type: string
 *           example: PENDIENTE
 *         fechaExpiracion:
 *           type: string
 *           format: date-time
 *           example: 2026-08-01T12:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-30T10:15:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-30T10:15:00.000Z
 *         empresa:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             nombre:
 *               type: string
 *               example: EcoHarmony
 *             actividad:
 *               type: string
 *               nullable: true
 *               example: Tecnología
 *             logoUrl:
 *               type: string
 *               nullable: true
 *               example: https://cdn.example.com/logo.png
 *             activo:
 *               type: boolean
 *               example: true
 *             curso:
 *               type: object
 *               properties:
 *                 idCurso:
 *                   type: integer
 *                   example: 2
 *                 nombreCurso:
 *                   type: string
 *                   example: 6° A
 *         createdBy:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: Juan
 *             apellido:
 *               type: string
 *               example: Pérez
 */
