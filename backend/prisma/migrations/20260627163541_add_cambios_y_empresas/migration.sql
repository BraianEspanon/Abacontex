/*
  Warnings:

  - You are about to drop the `usuario_cursos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "usuario_cursos" DROP CONSTRAINT "usuario_cursos_idCurso_fkey";

-- DropForeignKey
ALTER TABLE "usuario_cursos" DROP CONSTRAINT "usuario_cursos_idUsuario_fkey";

-- DropTable
DROP TABLE "usuario_cursos";

-- CreateTable
CREATE TABLE "alumnos" (
    "id" TEXT NOT NULL,
    "idCurso" INTEGER NOT NULL,
    "idRolEmpresa" INTEGER,
    "idEmpresa" INTEGER,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesor_cursos" (
    "idCurso" INTEGER NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "profesor_cursos_pkey" PRIMARY KEY ("idCurso","idUsuario")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "idCurso" INTEGER NOT NULL,
    "idCicloLectivo" INTEGER NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_empresa" (
    "idRol" SERIAL NOT NULL,
    "nombreRol" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_empresa_pkey" PRIMARY KEY ("idRol")
);

-- CreateIndex
CREATE INDEX "alumnos_idCurso_idx" ON "alumnos"("idCurso");

-- CreateIndex
CREATE INDEX "alumnos_idEmpresa_idx" ON "alumnos"("idEmpresa");

-- CreateIndex
CREATE INDEX "alumnos_idRolEmpresa_idx" ON "alumnos"("idRolEmpresa");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nombre_key" ON "empresas"("nombre");

-- CreateIndex
CREATE INDEX "empresas_idCurso_idx" ON "empresas"("idCurso");

-- CreateIndex
CREATE INDEX "empresas_idCicloLectivo_idx" ON "empresas"("idCicloLectivo");

-- CreateIndex
CREATE UNIQUE INDEX "roles_empresa_nombreRol_key" ON "roles_empresa"("nombreRol");

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_idRolEmpresa_fkey" FOREIGN KEY ("idRolEmpresa") REFERENCES "roles_empresa"("idRol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_idEmpresa_fkey" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor_cursos" ADD CONSTRAINT "profesor_cursos_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("idCurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor_cursos" ADD CONSTRAINT "profesor_cursos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_idCicloLectivo_fkey" FOREIGN KEY ("idCicloLectivo") REFERENCES "ciclo_lectivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
