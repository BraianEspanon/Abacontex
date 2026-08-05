/*
  Warnings:

  - Added the required column `cantidadConStock` to the `detalles_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidadPendiente` to the `detalles_pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detalles_pedido" ADD COLUMN     "cantidadConStock" INTEGER NOT NULL,
ADD COLUMN     "cantidadPendiente" INTEGER NOT NULL;
