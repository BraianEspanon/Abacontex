/**
 * @openapi
 * /finanzas/conciliaciones/resumen:
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Obtener resumen para conciliación (Cabezal)
 *     description: Devuelve el saldo del sistema, cantidad de movimientos del periodo y la fecha de la última conciliación.
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Resumen de conciliación generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConciliacionResumen'
 *       401:
 *         description: No autenticado.
 *       409:
 *         description: El usuario no pertenece a ninguna empresa.
 *
 * /finanzas/conciliaciones:
 *   post:
 *     tags:
 *       - Finanzas
 *     summary: Registrar una nueva conciliación financiera
 *     description: Permite registrar una conciliación de caja comparando el saldo del sistema con el contado físicamente. Si hay diferencia, se requiere una observación.
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrarConciliacionRequest'
 *     responses:
 *       200:
 *         description: Conciliación registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConciliacionCreadaResponse'
 *       400:
 *         description: Error de validación o lógica de negocio (ej. falta observación cuando hay diferencia).
 *       401:
 *         description: No autenticado.
 *       409:
 *         description: Se registraron movimientos financieros recientes, o el usuario no pertenece a una empresa.
 *
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Obtener historial de conciliaciones
 *     description: Devuelve el listado paginado de conciliaciones financieras pasadas.
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página.
 *     responses:
 *       200:
 *         description: Historial de conciliaciones obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialConciliacionesResponse'
 *       401:
 *         description: No autenticado.
 *       409:
 *         description: El usuario no pertenece a ninguna empresa.
 */
