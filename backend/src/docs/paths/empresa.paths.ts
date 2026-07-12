/**
 * @openapi
 * /empresas:
 *   post:
 *     summary: Crear una empresa
 *     description: |
 *       Permite crear una empresa asociada al curso del alumno autenticado.
 *       Solo un alumno con rol Director Ejecutivo (CEO) puede ejecutar esta operación.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpresaCrearRequest'
 *
 *     responses:
 *       201:
 *         description: Empresa creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaCreada'
 *
 *       400:
 *         description: Datos inválidos o la empresa ya existe.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para crear una empresa.
 *
 * /empresas/me:
 *   get:
 *     summary: Obtener la empresa del usuario autenticado
 *     description: |
 *       Devuelve los datos completos de la empresa a la que pertenece el alumno autenticado,
 *       incluyendo integrantes, curso y ciclo lectivo.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Información de la empresa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaActual'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol ALUMNO o no pertenece a una empresa.
 *
 *       404:
 *         description: El usuario no encontró una empresa asociada.
 *
 *   patch:
 *     summary: Actualizar datos de la empresa del usuario autenticado
 *     description: |
 *       Permite modificar los datos principales de la empresa a la que pertenece el alumno autenticado.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpresaActualizarRequest'
 *
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaActual'
 *
 *       400:
 *         description: Datos inválidos o nombre duplicado.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar la empresa.
 *
 * /empresas/candidatos:
 *   get:
 *     summary: Obtener candidatos para agregar a la empresa
 *     description: |
 *       Devuelve los alumnos del mismo curso que pueden incorporarse a la empresa.
 *       Acepta un filtro opcional por texto.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto opcional para filtrar candidatos por nombre, apellido o email.
 *
 *     responses:
 *       200:
 *         description: Lista de candidatos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CandidatoEmpresa'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar candidatos.
 *
 * /empresas/me/participantes:
 *   post:
 *     summary: Agregar participantes a la empresa
 *     description: |
 *       Agrega uno o más alumnos a la empresa del CEO autenticado.
 *       Los alumnos deben pertenecer al mismo curso y no estar previamente asignados a otra empresa.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantesRequest'
 *
 *     responses:
 *       204:
 *         description: Participantes agregados correctamente.
 *
 *       400:
 *         description: Datos inválidos o algún alumno no cumple las reglas de negocio.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para agregar participantes.
 *
 * /empresas/me/participantes/{idAlumno}/rol:
 *   patch:
 *     summary: Cambiar el rol de un participante de la empresa
 *     description: |
 *       Permite al CEO cambiar el rol empresarial de un integrante de su empresa.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idAlumno
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID del alumno cuya asignación se quiere modificar.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CambiarRolParticipanteRequest'
 *
 *     responses:
 *       204:
 *         description: Rol actualizado correctamente.
 *
 *       400:
 *         description: Datos inválidos o se intentó modificar un alumno no válido.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar roles.
 *
 * /empresas/{idEmpresa}/roles:
 *   patch:
 *     summary: Modificar los roles de todos los integrantes de una empresa
 *     description: |
 *       Permite a un docente asignar el rol empresarial de todos los integrantes de una empresa.
 *       Es necesario enviar la lista completa de integrantes.
 *
 *     tags:
 *       - Empresas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la empresa.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModificarRolesEmpresaRequest'
 *
 *     responses:
 *       204:
 *         description: Roles actualizados correctamente.
 *
 *       400:
 *         description: Datos inválidos o la estructura de roles no es válida.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar roles de empresa.
 */
