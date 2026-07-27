/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `productos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "productos_empresaId_nombre_key";

-- CreateIndex
CREATE UNIQUE INDEX "productos_empresaId_nombre_key" ON "productos"("empresaId", "nombre") WHERE ("activo" = true);
