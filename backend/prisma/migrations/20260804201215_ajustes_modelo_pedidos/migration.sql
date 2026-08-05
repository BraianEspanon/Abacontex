/*
  Warnings:

  - A unique constraint covering the columns `[pedidoId,productoId]` on the table `detalles_pedido` will be added. If there are existing duplicate values, this will fail.
  - Made the column `clienteMail` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "clienteMail" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "detalles_pedido_pedidoId_productoId_key" ON "detalles_pedido"("pedidoId", "productoId");

-- CreateIndex
CREATE INDEX "pedidos_empresaId_estadoId_idx" ON "pedidos"("empresaId", "estadoId");
