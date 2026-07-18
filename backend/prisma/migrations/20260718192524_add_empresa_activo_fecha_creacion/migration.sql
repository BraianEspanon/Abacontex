-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fechaCreacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "empresas_activo_idx" ON "empresas"("activo");

-- CreateIndex
CREATE INDEX "empresas_idCurso_activo_idx" ON "empresas"("idCurso", "activo");
