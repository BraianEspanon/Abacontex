/**
 * @openapi
 * /cursos:
 *   get:
 *     summary: Obtener lista de cursos
 *     description: |
 *       Devuelve todos los cursos disponibles ordenados por nombre.
 *
 *     tags:
 *       - Cursos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de cursos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar los cursos.
 */
