/*
  Warnings:

  - The primary key for the `cursos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `cursos` table. All the data in the column will be lost.
  - The primary key for the `roles_sistema` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `roles_sistema` table. All the data in the column will be lost.
  - You are about to drop the column `cursoId` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombreCurso]` on the table `cursos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombreCurso` to the `cursos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_rolSistemaId_fkey";

-- DropIndex
DROP INDEX "cursos_nombre_key";

-- AlterTable
ALTER TABLE "cursos" DROP CONSTRAINT "cursos_pkey",
DROP COLUMN "id",
DROP COLUMN "nombre",
ADD COLUMN     "idCurso" SERIAL NOT NULL,
ADD COLUMN     "nombreCurso" TEXT NOT NULL,
ADD CONSTRAINT "cursos_pkey" PRIMARY KEY ("idCurso");

-- AlterTable
ALTER TABLE "roles_sistema" DROP CONSTRAINT "roles_sistema_pkey",
DROP COLUMN "id",
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "idRol" SERIAL NOT NULL,
ADD CONSTRAINT "roles_sistema_pkey" PRIMARY KEY ("idRol");

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "cursoId";

-- CreateTable
CREATE TABLE "ciclo_lectivo" (
    "id" SERIAL NOT NULL,
    "año" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ciclo_lectivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_cursos" (
    "idCurso" INTEGER NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "usuario_cursos_pkey" PRIMARY KEY ("idCurso","idUsuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nombreCurso_key" ON "cursos"("nombreCurso");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolSistemaId_fkey" FOREIGN KEY ("rolSistemaId") REFERENCES "roles_sistema"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cursos" ADD CONSTRAINT "usuario_cursos_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("idCurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cursos" ADD CONSTRAINT "usuario_cursos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
