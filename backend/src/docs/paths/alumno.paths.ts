/**
 * @openapi
 * /alumnos/me:
 *
 *   get:
 *     summary: Obtener información del alumno autenticado
 *     description: |
 *       Devuelve la información del alumno autenticado junto con
 *       su curso, rol dentro de la empresa y empresa asociada.
 *       Si el alumno aún no completó el registro,
 *       registroCompleto será false.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Información del alumno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoActual'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *
 *   patch:
 *     summary: Completar registro del alumno
 *     description: |
 *       Permite completar la información académica del alumno
 *       luego del registro inicial realizado en Keycloak.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompletarRegistroRequest'
 *
 *     responses:
 *       200:
 *           description: Registro completado correctamente.
 *           content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AlumnoActual'
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 */
