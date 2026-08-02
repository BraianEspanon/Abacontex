/**
 * @openapi
 * /productos:
 *   get:
 *     summary: Obtener productos de la empresa del usuario autenticado
 *     description: |
 *       Devuelve los productos activos de la empresa asociada al alumno autenticado.
 *       Permite filtrar por texto, estado de stock, ordenamiento y paginación.
 *
 *     tags:
 *       - Productos
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
 *         description: Texto para filtrar productos por nombre.
 *
 *       - in: query
 *         name: estadoStock
 *         required: false
 *         schema:
 *           type: string
 *           enum: [TODOS, CON_STOCK, SIN_STOCK]
 *           default: TODOS
 *         description: Filtra productos según su disponibilidad de stock.
 *
 *       - in: query
 *         name: orden
 *         required: false
 *         schema:
 *           type: string
 *           enum: [NOMBRE_ASC, NOMBRE_DESC, STOCK_ASC, STOCK_DESC]
 *           default: NOMBRE_ASC
 *         description: Ordenamiento de la lista de productos.
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
 *         description: Cantidad de productos por página.
 *
 *     responses:
 *       200:
 *         description: Lista paginada de productos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductosResponse'
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar productos.
 *
 *   post:
 *     summary: Crear un producto
 *     description: |
 *       Crea un nuevo producto para la empresa asociada al usuario autenticado.
 *       El producto no puede duplicar el nombre dentro de la misma empresa.
 *       Admite subir una imagen en el campo `foto`.
 *
 *     tags:
 *       - Productos
 *
 *     security:
 *       - oauth2: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoCrearRequest'
 *
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *
 *       400:
 *         description: Datos inválidos o empresa no válida.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para crear productos.
 *
 *       409:
 *         description: Ya existe un producto con el mismo nombre.
 *
 * /productos/{idProducto}:
 *   get:
 *     summary: Obtener un producto por id
 *     description: |
 *       Devuelve un producto activo específico perteneciente a la empresa del usuario autenticado.
 *
 *     tags:
 *       - Productos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del producto.
 *
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para consultar productos.
 *
 *       404:
 *         description: Producto no encontrado.
 *
 *   patch:
 *     summary: Actualizar un producto
 *     description: |
 *       Actualiza los datos de un producto perteneciente a la empresa del usuario autenticado.
 *       Admite subir una nueva imagen en el campo `foto` o eliminar la actual con `eliminarFoto`.
 *
 *     tags:
 *       - Productos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del producto.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoActualizarRequest'
 *
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para modificar productos.
 *
 *       404:
 *         description: Producto no encontrado.
 *
 *       409:
 *         description: Ya existe un producto con el mismo nombre.
 *
 *   delete:
 *     summary: Eliminar un producto
 *     description: |
 *       Marca como inactivo un producto perteneciente a la empresa del usuario autenticado.
 *
 *     tags:
 *       - Productos
 *
 *     security:
 *       - oauth2: []
 *
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Identificador del producto.
 *
 *     responses:
 *       204:
 *         description: Producto eliminado correctamente.
 *
 *       401:
 *         description: Token inválido o inexistente.
 *
 *       403:
 *         description: El usuario no posee permisos para eliminar productos.
 *
 *       404:
 *         description: Producto no encontrado.
 */
