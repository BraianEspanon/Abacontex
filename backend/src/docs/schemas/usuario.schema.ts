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
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *         fechaAlta:
 *           type: string
 *           format: date-time
 *         rolSistema:
 *           type: object
 *           properties:
 *             idRol:
 *               type: integer
 *             nombreRol:
 *               type: string
 *             descripcion:
 *               type: string
 *               nullable: true
 *
 *     UsuarioSincronizado:
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
 *         rolSistemaId:
 *           type: integer
 *         fotoPerfilUrl:
 *           type: string
 *           nullable: true
 *         fechaAlta:
 *           type: string
 *           format: date-time
 *
 *     UsuarioCrearRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - password
 *         - rol
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan
 *           description: Nombre del usuario.
 *
 *         apellido:
 *           type: string
 *           example: Pérez
 *           description: Apellido del usuario.
 *
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@abacontex.com
 *           description: Email único del usuario, usado como nombre de usuario en Keycloak.
 *
 *         password:
 *           type: string
 *           minLength: 8
 *           example: MiPassword123
 *           description: Contraseña inicial del usuario.
 *
 *         rol:
 *           type: string
 *           enum: [ADMIN, DOCENTE, ALUMNO]
 *           example: DOCENTE
 *           description: Rol del usuario en el sistema.
 *
 *
 *     UsuarioActualizarRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan
 *           description: Nombre del usuario.
 *
 *         apellido:
 *           type: string
 *           example: Pérez
 *           description: Apellido del usuario.
 *
 *         idRolEmpresa:
 *           type: integer
 *           nullable: true
 *           example: 2
 *           description: Identificador del rol dentro de la empresa (opcional).
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
