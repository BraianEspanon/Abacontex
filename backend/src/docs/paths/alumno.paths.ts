/**
 * @openapi
 * /alumnos/me:
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
 *       - oauth2: []
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
 * /alumnos/me/invitacion:
 *   get:
 *     summary: Obtener la invitación activa del alumno
 *     description: |
 *       Devuelve una invitación asociada al alumno autenticado cuando existe una invitación
 *       en estado PENDIENTE o ACEPTADA. Si la invitación está pendiente y vencida,
 *       el backend la marca automáticamente como EXPIRADA y responde 404.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Invitación recuperada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvitacionAlumno'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *       404:
 *         description: El usuario no posee invitaciones activas o válidas.
 *
 * /alumnos/me/invitacion/{id}/aceptar:
 *   post:
 *     summary: Aceptar una invitación de empresa
 *     description: |
 *       Cambia el estado de la invitación a ACEPTADA.
 *       No incorpora al alumno a la empresa ni le asigna rol empresarial todavía.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la invitación.
 *
 *     responses:
 *       204:
 *         description: Invitación aceptada correctamente.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *       409:
 *         description: La invitación ya fue procesada, expiró o no cumple las reglas de negocio.
 *
 * /alumnos/me/invitacion/{id}/rechazar:
 *   post:
 *     summary: Rechazar una invitación de empresa
 *     description: |
 *       Cambia el estado de la invitación a CANCELADA.
 *       El frontend debe continuar luego con el flujo de registro normal.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la invitación.
 *
 *     responses:
 *       204:
 *         description: Invitación rechazada correctamente.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *       409:
 *         description: La invitación ya fue procesada, expiró o no cumple las reglas de negocio.
 *
 * /alumnos/me/registro:
 *   get:
 *     summary: Obtener los datos necesarios para completar el registro
 *     description: |
 *       Devuelve los datos necesarios para construir la pantalla de completar registro.
 *       El backend distingue entre dos flujos:
 *       - NORMAL: devuelve cursos y roles empresariales.
 *       - INVITACION: devuelve la empresa y el curso preasignados por el backend, además de roles disponibles sin CEO.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Datos de registro obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *   patch:
 *     summary: Completar registro del alumno
 *     description: |
 *       Completa el registro del alumno y soporta ambos flujos:
 *       - Registro normal: requiere el curso y el rol empresarial.
 *       - Registro por invitación: solo requiere el rol empresarial, y el backend asocia la empresa y el curso de la invitación aceptada.
 *
 *     tags:
 *       - Alumnos
 *
 *     security:
 *       - oauth2: []
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
 *         description: Registro completado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnoActual'
 *
 *       400:
 *         description: Datos inválidos o faltan datos para el flujo normal.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO.
 *
 *       409:
 *         description: El registro ya fue completado o la invitación no cumple las reglas de negocio.
 */
