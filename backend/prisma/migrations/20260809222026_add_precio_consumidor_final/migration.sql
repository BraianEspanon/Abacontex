/*
  Warnings:

  - A unique constraint covering the columns `[pedidoId,productoId]` on the table `ordenes_produccion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `año` to the `cursos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "año" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "precioConsumidorFinal" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "cursos_año_idx" ON "cursos"("año");

-- CreateIndex
CREATE UNIQUE INDEX "unique_pedido_producto_orden" ON "ordenes_produccion"("pedidoId", "productoId");
