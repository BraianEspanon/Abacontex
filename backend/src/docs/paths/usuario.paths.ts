/**
 * @openapi
 * /usuarios/me/password:
 *   patch:
 *     summary: Actualizar contraseña del usuario autenticado
 *     description: |
 *       Permite cambiar la contraseña del usuario autenticado.
 *
 *       Para realizar el cambio es necesario proporcionar
 *       la contraseña actual y una nueva contraseña válida.
 *
 *     tags:
 *       - Usuarios
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarPasswordRequest'
 *
 *     responses:
 *       204:
 *         description: Contraseña actualizada correctamente.
 *
 *       400:
 *         description: |
 *           Datos inválidos o la nueva contraseña no cumple las validaciones.
 *
 *       401:
 *         description: |
 *           Token inválido o la contraseña actual es incorrecta.
 *
 *       404:
 *         description: Usuario inexistente.
 */
