/**
 * @openapi
 * /docentes:
 *   post:
 *     summary: Crear un docente
 *     description: |
 *       Crea un nuevo docente en el sistema y le asigna uno o más cursos.
 *       Requiere permisos de administrador.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocenteCrearRequest'
 *
 *     responses:
 *       201:
 *         description: Docente creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteCreado'
 *
 *       400:
 *         description: Datos inválidos o uno o más cursos no existen.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos de administrador.
 *
 * /docentes/me:
 *   get:
 *     summary: Obtener información del docente autenticado
 *     description: |
 *       Devuelve los datos del docente autenticado junto con los cursos que dicta.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Información del docente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteActual'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 *       404:
 *         description: Docente no encontrado.
 *
 * /docentes/me/dashboard:
 *   get:
 *     summary: Obtener dashboard del docente autenticado
 *     description: |
 *       Devuelve un resumen inicial del dashboard del docente.
 *       En la implementación actual, los valores son placeholders y se irán completando en futuras iteraciones.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Dashboard del docente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardDocente'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 * /docentes/me/cursos:
 *   patch:
 *     summary: Actualizar cursos del docente autenticado
 *     description: |
 *       Permite al docente actualizar la lista de cursos que dicta.
 *       Se reemplaza la asignación actual por los cursoIds enviados.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocenteActualizarCursosRequest'
 *
 *     responses:
 *       200:
 *         description: Cursos del docente actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteActual'
 *
 *       400:
 *         description: Datos inválidos o uno o más cursos no existen.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 *   get:
 *     summary: Obtener los cursos asignados al docente autenticado
 *     description: |
 *       Devuelve los cursos vinculados al docente autenticado con métricas básicas para la vista de gestión.
 *       Algunos campos pueden venir en null en la implementación actual.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Lista de cursos del docente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CursoDocente'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 * /docentes/me/empresas:
 *   get:
 *     summary: Obtener empresas asociadas al docente autenticado
 *     description: |
 *       Devuelve las empresas vinculadas a los cursos del docente autenticado.
 *       Permite filtrar por curso, buscar por texto y paginar resultados.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Filtra empresas por el identificador del curso.
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto para buscar empresas por nombre, actividad o contacto.
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página a consultar.
 *
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de elementos por página.
 *
 *     responses:
 *       200:
 *         description: Empresas encontradas para el docente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresasDocenteResponse'
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 * /docentes/me/empresas/{empresaId}:
 *   get:
 *     summary: Obtener detalle de una empresa asociada al docente autenticado
 *     description: |
 *       Devuelve el detalle completo de una empresa, incluyendo integrantes y datos de contacto.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador de la empresa a consultar.
 *
 *     responses:
 *       200:
 *         description: Detalle de la empresa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpresaDocenteDetalle'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 *
 *       404:
 *         description: No se encontró la empresa para el docente autenticado.
 *
 * /docentes/me/alumnos:
 *   get:
 *     summary: Obtener alumnos vinculados al docente autenticado
 *     description: |
 *       Devuelve la lista de alumnos relacionados con los cursos y empresas del docente autenticado.
 *       Permite filtrar por curso, empresa, texto y paginar resultados.
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Filtra alumnos por el identificador del curso.
 *
 *       - in: query
 *         name: empresaId
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Filtra alumnos por el identificador de la empresa.
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto para filtrar alumnos por nombre, apellido o email.
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página a consultar.
 *
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de elementos por página.
 *
 *     responses:
 *       200:
 *         description: Alumnos encontrados para el docente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlumnosDocenteResponse'
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee el rol DOCENTE.
 */
