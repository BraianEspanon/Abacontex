/**
 * @openapi
 * /contabilidad/cuentas/tipos:
 *   get:
 *     summary: Obtener catálogo de tipos de cuenta con rubros
 *     description: |
 *       Devuelve el listado completo de tipos de cuenta contable activos junto a sus rubros correspondientes.
 *       Permite al frontend poblar los desplegables de filtrado y creación de cuentas.
 *
 *     tags:
 *       - Manual de cuentas
 *
 *     security:
 *       - oauth2: []
 *
 *     responses:
 *       200:
 *         description: Lista de tipos de cuenta con rubros anidados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoCuentaConRubros'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 * /contabilidad/cuentas:
 *   get:
 *     summary: Consultar Manual de Cuentas
 *     description: |
 *       Devuelve la lista paginada de cuentas contables del sistema.
 *       Permite filtrar por nombre, idRubro o idTipoCuenta, ordenadas por código ascendente.
 *
 *     tags:
 *       - Manual de cuentas
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
 *         description: Texto para filtrar cuentas por nombre.
 *
 *       - in: query
 *         name: idTipoCuenta
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID de tipo de cuenta para filtrar.
 *
 *       - in: query
 *         name: idRubro
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID de rubro para filtrar.
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
 *         description: Cantidad de cuentas por página.
 *
 *     responses:
 *       200:
 *         description: Lista paginada de cuentas contables.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CuentasResponse'
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *   post:
 *     summary: Registrar cuenta en el Manual de Cuentas
 *     description: |
 *       Crea una nueva cuenta contable en el sistema.
 *       Requiere rol DOCENTE. Valida unicidad de código y nombre.
 *
 *     tags:
 *       - Manual de cuentas
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuentaRegistrarRequest'
 *
 *     responses:
 *       201:
 *         description: Cuenta contable creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CuentaContable'
 *
 *       400:
 *         description: Datos de entrada inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee rol DOCENTE.
 *
 *       404:
 *         description: El rubro especificado no existe o está inactivo.
 *
 *       409:
 *         description: Ya existe una cuenta registrada con el código o nombre ingresado.
 *
 * /contabilidad/cuentas/{idCuenta}:
 *   patch:
 *     summary: Editar cuenta del Manual de Cuentas
 *     description: |
 *       Modifica el nombre y/o descripción de una cuenta contable existente.
 *       Requiere rol DOCENTE. Valida la unicidad del nuevo nombre.
 *
 *     tags:
 *       - Manual de cuentas
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idCuenta
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta contable a modificar.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuentaEditarRequest'
 *
 *     responses:
 *       200:
 *         description: Cuenta contable actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CuentaContable'
 *
 *       400:
 *         description: Datos de entrada o ID de cuenta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee rol DOCENTE.
 *
 *       404:
 *         description: Cuenta contable no encontrada.
 *
 *       409:
 *         description: Ya existe otra cuenta registrada con el mismo nombre.
 */
