-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "margenGanancia" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "precioVenta" DECIMAL(14,2) NOT NULL DEFAULT 0;
