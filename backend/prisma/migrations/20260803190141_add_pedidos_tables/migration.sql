-- CreateTable
CREATE TABLE "estados_pedido" (
    "idEstado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_pedido_pkey" PRIMARY KEY ("idEstado")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "idPedido" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteMail" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montoTotal" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("idPedido")
);

-- CreateTable
CREATE TABLE "detalles_pedido" (
    "idDetallePedido" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "detalles_pedido_pkey" PRIMARY KEY ("idDetallePedido")
);

-- CreateIndex
CREATE UNIQUE INDEX "estados_pedido_nombre_key" ON "estados_pedido"("nombre");

-- CreateIndex
CREATE INDEX "pedidos_empresaId_idx" ON "pedidos"("empresaId");

-- CreateIndex
CREATE INDEX "pedidos_estadoId_idx" ON "pedidos"("estadoId");

-- CreateIndex
CREATE INDEX "pedidos_usuarioId_idx" ON "pedidos"("usuarioId");

-- CreateIndex
CREATE INDEX "pedidos_fecha_idx" ON "pedidos"("fecha");

-- CreateIndex
CREATE INDEX "detalles_pedido_pedidoId_idx" ON "detalles_pedido"("pedidoId");

-- CreateIndex
CREATE INDEX "detalles_pedido_productoId_idx" ON "detalles_pedido"("productoId");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estados_pedido"("idEstado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("idPedido") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
