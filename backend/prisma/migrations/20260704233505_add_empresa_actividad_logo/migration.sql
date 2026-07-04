/*
  Warnings:

  - Added the required column `actividad` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "actividad" TEXT NOT NULL,
ADD COLUMN     "logoUrl" TEXT;
