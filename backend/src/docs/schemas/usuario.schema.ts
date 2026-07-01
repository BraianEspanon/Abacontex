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
 */
