-- CreateTable
CREATE TABLE "diagnosticos_cursos" (
    "idDiagnostico" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "docenteId" TEXT NOT NULL,
    "resumenGeneral" TEXT NOT NULL,
    "cosasAReforzar" JSONB NOT NULL,
    "totalErroresEnSnapshot" INTEGER NOT NULL,
    "errorPrincipalEnSnapshot" TEXT NOT NULL,
    "plantillaPrincipalEnSnapshot" TEXT NOT NULL,
    "distribucionEnSnapshot" JSONB NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "diagnosticos_cursos_pkey" PRIMARY KEY ("idDiagnostico")
);

-- CreateIndex
CREATE UNIQUE INDEX "diagnosticos_cursos_cursoId_docenteId_key" ON "diagnosticos_cursos"("cursoId", "docenteId");

-- AddForeignKey
ALTER TABLE "diagnosticos_cursos" ADD CONSTRAINT "diagnosticos_cursos_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("idCurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos_cursos" ADD CONSTRAINT "diagnosticos_cursos_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
