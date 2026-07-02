/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Permite crear un nuevo usuario en el sistema.
 *       Solo los administradores pueden crear usuarios.
 *       El usuario se crea tanto en Keycloak como en la base de datos.
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
 *             $ref: '#/components/schemas/UsuarioCrearRequest'
 *
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioActual'
 *
 *       400:
 *         description: Datos inválidos o el usuario ya existe.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos de administrador.
 *
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
