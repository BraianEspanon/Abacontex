/*
  Warnings:

  - You are about to drop the column `codigo` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `costoUnitario` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `precioVenta` on the `productos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,nombre]` on the table `productos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `precioUnitario` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Made the column `descripcion` on table `productos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "productos_empresaId_codigo_key";

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "codigo",
DROP COLUMN "costoUnitario",
DROP COLUMN "precioVenta",
ADD COLUMN     "fotoUrl" TEXT,
ADD COLUMN     "precioUnitario" DECIMAL(14,2) NOT NULL,
ALTER COLUMN "descripcion" SET NOT NULL;

-- CreateIndex
CREATE INDEX "productos_activo_idx" ON "productos"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_empresaId_nombre_key" ON "productos"("empresaId", "nombre");
