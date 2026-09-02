/**
 * @openapi
 * /contabilidad/libro-mayor:
 *   get:
 *     summary: Consultar Libro Mayor
 *     description: Devuelve la lista completa de folios del Libro Mayor acumulados por cuenta para la empresa del alumno.
 *     tags: [Contabilidad]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Listado del Libro Mayor obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CuentaLibroMayorItem'

 * /contabilidad/estado-resultados:
 *   get:
 *     summary: Consultar Estado de Resultados
 *     description: Devuelve el reporte económico de Ingresos, Egresos y Resultado del Ejercicio (Ganancia/Pérdida/Neutro).
 *     tags: [Contabilidad]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Estado de Resultados obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoResultadosResponse'

 * /contabilidad/balance-general:
 *   get:
 *     summary: Consultar Balance General
 *     description: Devuelve la estructura patrimonial (Activos, Pasivos, Patrimonio Neto) y verifica la ecuación patrimonial A = P + PN.
 *     tags: [Contabilidad]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Balance General obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceGeneralResponse'

 * /contabilidad/asientos/libro-diario:
 *   get:
 *     summary: Consultar Libro Diario completo
 *     description: Devuelve todos los asientos registrados en la empresa ordenados por número de asiento.
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Libro Diario obtenido exitosamente.

 * /contabilidad/asientos/tipos-movimiento:
 *   get:
 *     summary: Obtener tipos de movimiento contables
 *     description: Devuelve el mapa de tipos de movimiento (A+, A-, P+, P-, PN, R+, R-) para poblar selectores.
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Lista de tipos de movimiento obtenida exitosamente.

 * /contabilidad/asientos/cuentas:
 *   get:
 *     summary: Obtener cuentas del alumno con su número de folio asignado
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Lista de cuentas con folios obtenida exitosamente.

 * /contabilidad/asientos/resumen:
 *   get:
 *     summary: Obtener métricas resumidas de asientos de la empresa
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Resumen de métricas obtenido exitosamente.

 * /contabilidad/asientos/ultimos:
 *   get:
 *     summary: Obtener últimos asientos registrados
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Últimos asientos obtenidos exitosamente.

 * /contabilidad/asientos/pendientes:
 *   get:
 *     summary: Obtener operaciones pendientes de contabilizar
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Operaciones pendientes obtenidas exitosamente.

 * /contabilidad/asientos/pendientes/{tipo}/{id}:
 *   get:
 *     summary: Obtener detalle de una operación pendiente de contabilizar
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la operación pendiente obtenido exitosamente.

 * /contabilidad/asientos/{idAsiento}:
 *   get:
 *     summary: Obtener un asiento por su ID
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: idAsiento
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asiento obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsientoContableItem'

 *   patch:
 *     summary: Modificar un asiento contable existente
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: path
 *         name: idAsiento
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearAsientoRequest'
 *     responses:
 *       200:
 *         description: Asiento modificado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsientoContableItem'

 * /contabilidad/asientos:
 *   post:
 *     summary: Registrar un nuevo asiento contable
 *     tags: [Asientos Contables]
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearAsientoRequest'
 *     responses:
 *       201:
 *         description: Asiento registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsientoContableItem'
 */
