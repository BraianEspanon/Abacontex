/**
 * @openapi
 * /finanzas/resumen:
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Obtener resumen financiero (Cabezal)
 *     description: Devuelve los indicadores principales de la empresa del alumno autenticado (Ingresos, Egresos, Flujo Neto y resumen del mes actual).
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Resumen financiero generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimientoFinancieroResumen'
 *       401:
 *         description: No autenticado.
 *       409:
 *         description: El usuario no pertenece a ninguna empresa.
 *
 * /finanzas/grafico:
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Obtener datos para gráfico financiero
 *     description: Devuelve los movimientos financieros agrupados según el periodo solicitado.
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *           enum: [mes, 6meses, ciclo]
 *           default: ciclo
 *         description: El periodo para agrupar los datos.
 *     responses:
 *       200:
 *         description: Datos para gráfico generados exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovimientoFinancieroGraficoItem'
 *       401:
 *         description: No autenticado.
 *
 * /finanzas/movimientos:
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Obtener historial de movimientos financieros
 *     description: Devuelve el historial paginado de ingresos y egresos de la empresa.
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
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mes (1 a 12).
 *       - in: query
 *         name: idTipoMovimiento
 *         schema:
 *           type: integer
 *         description: Filtrar por tipo de movimiento (ej. Ingreso, Egreso).
 *     responses:
 *       200:
 *         description: Historial de movimientos generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimientoFinancieroListResponse'
 *       401:
 *         description: No autenticado.
 *
 * /finanzas/tipos-movimiento:
 *   get:
 *     tags:
 *       - Finanzas
 *     summary: Listar tipos de movimientos
 *     description: Devuelve el catálogo fijo de tipos de movimiento (ej. INGRESO, EGRESO).
 *     security:
 *       - oauth2: []
 *     responses:
 *       200:
 *         description: Catálogo obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoMovimientoItem'
 *       401:
 *         description: No autenticado.
 */
