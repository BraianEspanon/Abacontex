/*
  Warnings:

  - You are about to drop the column `tipoMovimiento` on the `detalles_asiento_contable` table. All the data in the column will be lost.
  - Added the required column `movimiento` to the `detalles_asiento_contable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovimientoCuentaContable" AS ENUM ('A_MAS', 'A_MENOS', 'P_MAS', 'P_MENOS', 'PN', 'R_MAS', 'R_MENOS');

-- DropIndex
DROP INDEX "detalles_asiento_contable_tipoMovimiento_idx";

-- AlterTable
ALTER TABLE "detalles_asiento_contable" DROP COLUMN "tipoMovimiento",
ADD COLUMN     "movimiento" "MovimientoCuentaContable" NOT NULL;

-- DropEnum
DROP TYPE "TipoMovimientoContable";
