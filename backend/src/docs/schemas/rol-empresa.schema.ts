/**
 * @openapi
 * components:
 *   schemas:
 *     RolEmpresa:
 *       type: object
 *       properties:
 *         idRol:
 *           type: integer
 *           example: 1
 *         nombreRol:
 *           type: string
 *           example: "Alumno"
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: "Rol asignado a los alumnos"
 *       required:
 *         - idRol
 *         - nombreRol
 */
