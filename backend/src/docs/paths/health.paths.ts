/**
 * @openapi
 * /:
 *   get:
 *     summary: Verificar estado del backend
 *     description: |
 *       Endpoint simple para comprobar que el servicio está levantado.
 *       Útil para validaciones básicas de despliegue y monitoreo.
 *
 *     tags:
 *       - Health
 *
 *     responses:
 *       200:
 *         description: Backend funcionando.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Backend funcionando
 *
 * /health:
 *   get:
 *     summary: Health check de la API
 *     description: |
 *       Devuelve un estado básico del servicio para monitoreo y chequeos de disponibilidad.
 *
 *     tags:
 *       - Health
 *
 *     responses:
 *       200:
 *         description: Servicio operativo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
