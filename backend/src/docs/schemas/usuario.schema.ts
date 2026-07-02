/**
 * @openapi
 * components:
 *   schemas:
 *     UsuarioActual:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         keycloakId:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         rolSistema:
 *           type: object
 *           properties:
 *             idRol:
 *               type: integer
 *             nombreRol:
 *               type: string
 *         cursos:
 *           type: array
 *           items:
 *             type: object
 *
 *
 *     ActualizarPasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: MiPassword123
 *           description: Contraseña actual del usuario.
 *
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: NuevaPassword123
 *           description: Nueva contraseña que reemplazará a la actual.
 */
