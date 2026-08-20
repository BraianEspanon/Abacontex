/*
  Warnings:

  - Added the required column `cai` to the `facturas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaVencimiento` to the `facturas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localidad` to the `facturas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facturas" ADD COLUMN     "cai" VARCHAR(14) NOT NULL,
ADD COLUMN     "fechaVencimiento" DATE NOT NULL,
ADD COLUMN     "localidad" VARCHAR(100) NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);
