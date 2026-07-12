/**
 * @openapi
 * /usuarios/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     description: |
 *       Devuelve los datos del usuario autenticado,
 *       incluyendo su rol en el sistema.
 *
 *     tags:
 *       - Usuarios
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Información del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioActual'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       404:
 *         description: Usuario no encontrado.
 *
 *   patch:
 *     summary: Actualizar datos del usuario autenticado
 *     description: |
 *       Permite modificar los datos personales del usuario autenticado.
 *       Pueden actualizarse el nombre, apellido y el rol dentro de la empresa.
 *
 *     tags:
 *       - Usuarios
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioActualizarRequest'
 *
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioActual'
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
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
 *       - oauth2: []
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
