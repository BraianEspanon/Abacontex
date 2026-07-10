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
 */
