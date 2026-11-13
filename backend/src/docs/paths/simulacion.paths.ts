/**
 * @openapi
 * /simulaciones/opciones-crear:
 *   get:
 *     summary: Obtener opciones para el formulario de creación de simulaciones
 *     description: Retorna los listados de flujos empresariales predefinidos, niveles de dificultad, duraciones orientativas (con rango de eventos) y tipos de acontecimientos sorpresa disponibles para configurar una nueva simulación.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Opciones de configuración obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionesCrearSimulacionResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE.
 *
 * /simulaciones:
 *   get:
 *     summary: Listar simulaciones del docente con métricas del dashboard
 *     description: Retorna el listado paginado de simulaciones creadas por el docente autenticado, soportando filtros por curso, búsqueda por título y estado (TODAS, PENDIENTE, EN_CURSO, FINALIZADA). Incluye el resumen acumulado de métricas (total, pendientes, enCurso, finalizadas) y el porcentaje de avance de las empresas.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *         description: Cantidad de simulaciones a retornar por página.
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: integer
 *         description: Filtra las simulaciones asignadas al ID del curso especificado.
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Búsqueda de simulaciones cuyo título contenga este texto.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [TODAS, PENDIENTE, EN_CURSO, FINALIZADA]
 *           default: TODAS
 *         description: Filtra las simulaciones según su estado global.
 *     responses:
 *       200:
 *         description: Listado paginado y métricas del dashboard obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoSimulacionesDocenteResponse'
 *       400:
 *         description: Parámetros de consulta (query) inválidos.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol DOCENTE.
 *
 *   post:
 *     summary: Crear una nueva simulación empresarial mediante IA
 *     description: Permite al docente configurar los parámetros de una simulación y generar mediante IA el escenario pedagógico. En una única transacción atómica se crea la simulación base y se instancian los grafos adaptados para cada empresa del curso con sus roles e integrantes.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearSimulacionRequest'
 *     responses:
 *       201:
 *         description: Simulación creada y distribuida a las empresas del curso exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimulacionCreadaResponse'
 *       400:
 *         description: Parámetros inválidos, fecha límite expirada o el curso no tiene empresas activas con alumnos.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El docente no tiene permisos sobre el curso especificado.
 *
 * /simulaciones/{id}/titulo:
 *   patch:
 *     summary: Editar el título de una simulación
 *     description: Permite al docente creador modificar el título descriptivo de una simulación existente.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la simulación a modificar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditarTituloSimulacionRequest'
 *     responses:
 *       200:
 *         description: Título actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditarTituloSimulacionResponse'
 *       400:
 *         description: Título vacío o excede los 100 caracteres.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. La simulación pertenece a otro docente.
 *       404:
 *         description: Simulación no encontrada.
 *
 * /simulaciones/{id}/entregas:
 *   get:
 *     summary: Consultar entregas y avance de empresas en una simulación
 *     description: Retorna la cabecera informativa de la simulación y el listado paginado de todas las empresas participantes con su porcentaje de avance, integrantes, roles que intervinieron y puntaje final obtenido. Soporta búsqueda por nombre de empresa y filtrado por estado.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la simulación.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *         description: Cantidad de empresas por página.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra empresas cuyo nombre contenga este texto.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [TODAS, PENDIENTE, EN_CURSO, FINALIZADA]
 *           default: TODAS
 *         description: Filtra empresas según su estado de participación.
 *     responses:
 *       200:
 *         description: Cabecera y listado de entregas obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntregasSimulacionResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. El docente no tiene acceso al curso de esta simulación.
 *       404:
 *         description: Simulación no encontrada.
 *
 * /simulaciones/alumno/filtros:
 *   get:
 *     summary: Obtener opciones de filtro para el dashboard de simulaciones del alumno
 *     description: Retorna la lista de estados disponibles para filtrar en el dashboard del alumno con su clave y etiqueta visual amigable (Todas, Pendientes, En curso, Finalizadas, Requieren mi decisión).
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Opciones de filtrado obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiltrosDashboardAlumnoResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol ALUMNO.
 *
 * /simulaciones/alumno:
 *   get:
 *     summary: Listar simulaciones asignadas a la empresa del alumno
 *     description: Retorna el listado paginado de simulaciones de la empresa del alumno autenticado, con la bandera 'requiereMiDecision' indicando si el alumno tiene el rol requerido para resolver el evento actual. Incluye el resumen con los 5 contadores del dashboard de alumno (total, pendientes, enCurso, finalizadas, decisionesPorResponder).
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *         description: Cantidad de simulaciones por página.
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Búsqueda por título.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [TODAS, PENDIENTE, EN_CURSO, FINALIZADA]
 *           default: TODAS
 *         description: Filtra las simulaciones por estado.
 *     responses:
 *       200:
 *         description: Listado de simulaciones del alumno y métricas del dashboard obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListadoSimulacionesAlumnoResponse'
 *       400:
 *         description: El alumno no tiene una empresa asignada.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Acceso denegado. Se requiere rol ALUMNO.
 *
 * /simulaciones/conversacion/{id}:
 *   get:
 *     summary: Obtener la sala conversacional de una simulación empresarial
 *     description: Retorna el estado conversacional completo de la simulación de una empresa (progreso de acontecimientos, integrantes con sus avatares y roles, historial cronológico de mensajes y decisiones tomadas, y el acontecimiento activo con sus alternativas). El campo 'puedeDecidir' indica si el alumno autenticado está habilitado para responder según su rol en la empresa.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la simulación de la empresa (idSimulacionEmpresa).
 *     responses:
 *       200:
 *         description: Sala conversacional obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversacionSimulacionResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       404:
 *         description: La simulación empresarial no fue encontrada o el usuario no pertenece a la empresa/curso.
 *
 * /simulaciones/conversacion/{id}/responder:
 *   post:
 *     summary: Responder una decisión activa en la simulación empresarial
 *     description: Registra la respuesta del equipo al acontecimiento activo. Valida que el alumno pertenezca a la empresa y posea el rol habilitado para la decisión. Aplica los cambios simulados en las variables internas (caja, stock), avanza al siguiente evento del grafo y, al alcanzar el evento final, marca la empresa como FINALIZADA, calcula la nota (0 a 100) y genera el feedback pedagógico de Aba.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la simulación de la empresa (idSimulacionEmpresa).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponderDecisionSimulacionRequest'
 *     responses:
 *       200:
 *         description: Decisión registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponderDecisionSimulacionResponse'
 *       400:
 *         description: La opción seleccionada no pertenece al evento actual o es inválida.
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       403:
 *         description: Tu rol no está habilitado para tomar esta decisión.
 *       404:
 *         description: La simulación empresarial no fue encontrada o el alumno no pertenece a la empresa.
 *       409:
 *         description: Conflicto. La simulación ya finalizó, el plazo expiró, el evento actual no requiere decisión o la decisión ya fue tomada por otro compañero.
 *
 * /simulaciones/conversacion/{id}/resumen:
 *   get:
 *     summary: Obtener el resumen pedagógico y resultado final de la simulación
 *     description: Devuelve el informe de cierre pedagógico una vez que la simulación ha finalizado, incluyendo calificación obtenida sobre 100 puntos, conteo cualitativo de decisiones (muy adecuadas, adecuadas, poco adecuadas, inadecuadas), fechas de realización, roles intervinientes, balance final de variables simuladas y la devolución final de Aba generada con IA.
 *     tags:
 *       - Simulaciones
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la simulación de la empresa (idSimulacionEmpresa).
 *     responses:
 *       200:
 *         description: Resumen pedagógico y resultado obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumenSimulacionResponse'
 *       401:
 *         description: No autenticado o token inválido/expirado.
 *       404:
 *         description: La simulación empresarial no fue encontrada o el usuario no tiene acceso a ella.
 *       409:
 *         description: Conflicto. La simulación aún no ha finalizado.
 */
