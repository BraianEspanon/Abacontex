/*
  Warnings:

  - You are about to drop the column `idTipoCuenta` on the `cuentas_contables` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `tipos_cuenta_contable` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[abreviatura]` on the table `tipos_cuenta_contable` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idRubro` to the `cuentas_contables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abreviatura` to the `tipos_cuenta_contable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoOrigenAsiento" AS ENUM ('VENTA', 'MOVIMIENTO_FINANCIERO', 'CONCILIACION_FINANCIERA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "TipoMovimientoContable" AS ENUM ('AUMENTO_ACTIVO', 'DISMINUCION_ACTIVO', 'AUMENTO_PASIVO', 'DISMINUCION_PASIVO', 'PATRIMONIO_NETO', 'RESULTADO_POSITIVO', 'RESULTADO_NEGATIVO');

-- DropForeignKey
ALTER TABLE "cuentas_contables" DROP CONSTRAINT "cuentas_contables_idTipoCuenta_fkey";

-- DropIndex
DROP INDEX "cuentas_contables_idTipoCuenta_idx";

-- AlterTable
ALTER TABLE "cuentas_contables" DROP COLUMN "idTipoCuenta",
ADD COLUMN     "idRubro" INTEGER NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "tipos_cuenta_contable" ADD COLUMN     "abreviatura" VARCHAR(3) NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "rubros_cuenta_contable" (
    "idRubro" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "idTipoCuenta" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rubros_cuenta_contable_pkey" PRIMARY KEY ("idRubro")
);

-- CreateTable
CREATE TABLE "asientos_contables" (
    "idAsiento" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "numeroAsiento" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "conceptoGeneral" VARCHAR(255) NOT NULL,
    "origen" "TipoOrigenAsiento" NOT NULL,
    "ventaId" INTEGER,
    "movimientoFinancieroId" INTEGER,
    "conciliacionId" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "asientos_contables_pkey" PRIMARY KEY ("idAsiento")
);

-- CreateTable
CREATE TABLE "detalles_asiento_contable" (
    "idDetalleAsiento" SERIAL NOT NULL,
    "asientoId" INTEGER NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "tipoMovimiento" "TipoMovimientoContable" NOT NULL,
    "debe" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "haber" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "detalles_asiento_contable_pkey" PRIMARY KEY ("idDetalleAsiento")
);

-- CreateTable
CREATE TABLE "folios_cuenta_empresa" (
    "idFolioCuenta" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "numeroFolio" INTEGER NOT NULL,

    CONSTRAINT "folios_cuenta_empresa_pkey" PRIMARY KEY ("idFolioCuenta")
);

-- CreateIndex
CREATE INDEX "rubros_cuenta_contable_idTipoCuenta_idx" ON "rubros_cuenta_contable"("idTipoCuenta");

-- CreateIndex
CREATE INDEX "rubros_cuenta_contable_activo_idx" ON "rubros_cuenta_contable"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "rubros_cuenta_contable_idTipoCuenta_nombre_key" ON "rubros_cuenta_contable"("idTipoCuenta", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "asientos_contables_ventaId_key" ON "asientos_contables"("ventaId");

-- CreateIndex
CREATE UNIQUE INDEX "asientos_contables_movimientoFinancieroId_key" ON "asientos_contables"("movimientoFinancieroId");

-- CreateIndex
CREATE UNIQUE INDEX "asientos_contables_conciliacionId_key" ON "asientos_contables"("conciliacionId");

-- CreateIndex
CREATE INDEX "asientos_contables_empresaId_idx" ON "asientos_contables"("empresaId");

-- CreateIndex
CREATE INDEX "asientos_contables_alumnoId_idx" ON "asientos_contables"("alumnoId");

-- CreateIndex
CREATE INDEX "asientos_contables_fecha_idx" ON "asientos_contables"("fecha");

-- CreateIndex
CREATE INDEX "asientos_contables_origen_idx" ON "asientos_contables"("origen");

-- CreateIndex
CREATE INDEX "asientos_contables_empresaId_fecha_idx" ON "asientos_contables"("empresaId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "asientos_contables_empresaId_numeroAsiento_key" ON "asientos_contables"("empresaId", "numeroAsiento");

-- CreateIndex
CREATE INDEX "detalles_asiento_contable_asientoId_idx" ON "detalles_asiento_contable"("asientoId");

-- CreateIndex
CREATE INDEX "detalles_asiento_contable_cuentaId_idx" ON "detalles_asiento_contable"("cuentaId");

-- CreateIndex
CREATE INDEX "detalles_asiento_contable_tipoMovimiento_idx" ON "detalles_asiento_contable"("tipoMovimiento");

-- CreateIndex
CREATE UNIQUE INDEX "detalles_asiento_contable_asientoId_orden_key" ON "detalles_asiento_contable"("asientoId", "orden");

-- CreateIndex
CREATE INDEX "folios_cuenta_empresa_empresaId_idx" ON "folios_cuenta_empresa"("empresaId");

-- CreateIndex
CREATE INDEX "folios_cuenta_empresa_cuentaId_idx" ON "folios_cuenta_empresa"("cuentaId");

-- CreateIndex
CREATE UNIQUE INDEX "folios_cuenta_empresa_empresaId_cuentaId_key" ON "folios_cuenta_empresa"("empresaId", "cuentaId");

-- CreateIndex
CREATE UNIQUE INDEX "folios_cuenta_empresa_empresaId_numeroFolio_key" ON "folios_cuenta_empresa"("empresaId", "numeroFolio");

-- CreateIndex
CREATE INDEX "cuentas_contables_idRubro_idx" ON "cuentas_contables"("idRubro");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_cuenta_contable_abreviatura_key" ON "tipos_cuenta_contable"("abreviatura");

-- AddForeignKey
ALTER TABLE "rubros_cuenta_contable" ADD CONSTRAINT "rubros_cuenta_contable_idTipoCuenta_fkey" FOREIGN KEY ("idTipoCuenta") REFERENCES "tipos_cuenta_contable"("idTipoCuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_contables" ADD CONSTRAINT "cuentas_contables_idRubro_fkey" FOREIGN KEY ("idRubro") REFERENCES "rubros_cuenta_contable"("idRubro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("idVenta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_movimientoFinancieroId_fkey" FOREIGN KEY ("movimientoFinancieroId") REFERENCES "movimientos_financieros"("idMovimiento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_conciliacionId_fkey" FOREIGN KEY ("conciliacionId") REFERENCES "conciliaciones_financieras"("idConciliacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_asiento_contable" ADD CONSTRAINT "detalles_asiento_contable_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "asientos_contables"("idAsiento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_asiento_contable" ADD CONSTRAINT "detalles_asiento_contable_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "cuentas_contables"("idCuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios_cuenta_empresa" ADD CONSTRAINT "folios_cuenta_empresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios_cuenta_empresa" ADD CONSTRAINT "folios_cuenta_empresa_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "cuentas_contables"("idCuenta") ON DELETE RESTRICT ON UPDATE CASCADE;
