/*
  Warnings:

  - Added the required column `tipo` to the `notificaciones` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('EJERCICIO_NUEVO', 'VENCIMIENTO_PROXIMO', 'EJERCICIO_CORREGIDO');

-- AlterTable
ALTER TABLE "notificaciones" ADD COLUMN     "tipo" "TipoNotificacion" NOT NULL;
