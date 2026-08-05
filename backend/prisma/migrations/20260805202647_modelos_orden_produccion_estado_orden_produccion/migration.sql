-- CreateEnum
CREATE TYPE "PrioridadOrden" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateTable
CREATE TABLE "estados_orden_produccion" (
    "idEstado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_orden_produccion_pkey" PRIMARY KEY ("idEstado")
);

-- CreateTable
CREATE TABLE "ordenes_produccion" (
    "idOrden" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "pedidoId" INTEGER,
    "responsableId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "prioridad" "PrioridadOrden" NOT NULL DEFAULT 'MEDIA',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ordenes_produccion_pkey" PRIMARY KEY ("idOrden")
);

-- CreateIndex
CREATE UNIQUE INDEX "estados_orden_produccion_nombre_key" ON "estados_orden_produccion"("nombre");

-- CreateIndex
CREATE INDEX "ordenes_produccion_empresaId_idx" ON "ordenes_produccion"("empresaId");

-- CreateIndex
CREATE INDEX "ordenes_produccion_estadoId_idx" ON "ordenes_produccion"("estadoId");

-- CreateIndex
CREATE INDEX "ordenes_produccion_responsableId_idx" ON "ordenes_produccion"("responsableId");

-- CreateIndex
CREATE INDEX "ordenes_produccion_pedidoId_idx" ON "ordenes_produccion"("pedidoId");

-- CreateIndex
CREATE INDEX "ordenes_produccion_empresaId_estadoId_idx" ON "ordenes_produccion"("empresaId", "estadoId");

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estados_orden_produccion"("idEstado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("idPedido") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_produccion" ADD CONSTRAINT "ordenes_produccion_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
