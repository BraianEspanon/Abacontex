/**
 * @openapi
 * /roles-empresa:
 *   get:
 *     summary: Obtener roles de empresa
 *     description: |
 *       Devuelve todos los roles de empresa disponibles ordenados por identificador.
 *
 *     tags:
 *       - Roles de empresa
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Lista de roles de empresa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolEmpresa'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar los roles de empresa.
 */
