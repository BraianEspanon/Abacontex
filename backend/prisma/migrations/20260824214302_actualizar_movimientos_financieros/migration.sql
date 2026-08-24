/*
  Warnings:

  - A unique constraint covering the columns `[idTipoMovimiento,nombre]` on the table `categorias_movimiento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ventaId]` on the table `movimientos_financieros` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movimientos_financieros" ADD COLUMN     "referencia" TEXT,
ADD COLUMN     "ventaId" INTEGER,
ALTER COLUMN "fecha" SET DATA TYPE DATE,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_movimiento_idTipoMovimiento_nombre_key" ON "categorias_movimiento"("idTipoMovimiento", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "movimientos_financieros_ventaId_key" ON "movimientos_financieros"("ventaId");

-- CreateIndex
CREATE INDEX "movimientos_financieros_idEmpresa_fecha_idx" ON "movimientos_financieros"("idEmpresa", "fecha");

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("idVenta") ON DELETE SET NULL ON UPDATE CASCADE;
