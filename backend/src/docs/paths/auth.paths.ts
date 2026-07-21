/**
 * @openapi
 * /auth/sync-user:
 *   post:
 *     summary: Sincronizar usuario autenticado
 *     description: |
 *       Sincroniza el usuario autenticado en el sistema,
 *       creando un registro en la base de datos si no existe.
 *       Si el usuario ya existe, devuelve su información actual.
 *
 *     tags:
 *       - Auth
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Usuario sincronizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioSincronizado'
 *
 *       401:
 *         description: Token inválido o inexistente.
 */
