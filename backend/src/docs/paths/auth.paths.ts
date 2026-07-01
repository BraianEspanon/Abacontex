/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags:
 *       - Auth
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioActual'
 *
 *       401:
 *         description: Token inválido
 */
