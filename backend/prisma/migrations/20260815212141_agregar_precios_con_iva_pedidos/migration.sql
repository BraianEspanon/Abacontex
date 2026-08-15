/*
  Warnings:

  - Added the required column `precioUnitarioConIva` to the `detalles_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalConIva` to the `detalles_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoTotalConIva` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detalles_pedido" ADD COLUMN     "precioUnitarioConIva" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "subtotalConIva" DECIMAL(14,2) NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "montoTotalConIva" DECIMAL(14,2) NOT NULL;
