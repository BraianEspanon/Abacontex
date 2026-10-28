/**
 * @openapi
 * /cursos/me:
 *   get:
 *     summary: Obtener cursos asignados al usuario autenticado
 *     description: |
 *       Devuelve la lista de cursos asociados al usuario actual según su rol:
 *       - Para DOCENTE: cursos donde figura asignado como profesor.
 *       - Para ALUMNO: curso al que pertenece actualmente.
 *       - Para ADMIN: todos los cursos registrados.
 *       Provee el listado liviano para selectores, dropdowns y botones de filtrado.
 *     tags:
 *       - Cursos
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Lista de cursos del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       401:
 *         description: Token inválido o inexistente.
 *
 * /cursos:
 *   get:
 *     summary: Obtener lista de cursos
 *     description: |
 *       Devuelve todos los cursos disponibles ordenados por nombre.
 *     tags:
 *       - Cursos
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Lista de cursos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       401:
 *         description: Token inválido o inexistente.
 *       403:
 *         description: El usuario no posee permisos para consultar los cursos.
 */
