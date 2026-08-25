-- CreateTable
CREATE TABLE "conciliaciones_financieras" (
    "idConciliacion" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saldoEsperado" DECIMAL(14,2) NOT NULL,
    "saldoContado" DECIMAL(14,2) NOT NULL,
    "diferencia" DECIMAL(14,2) NOT NULL,
    "observacion" VARCHAR(250),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conciliaciones_financieras_pkey" PRIMARY KEY ("idConciliacion")
);

-- CreateIndex
CREATE INDEX "conciliaciones_financieras_empresaId_idx" ON "conciliaciones_financieras"("empresaId");

-- CreateIndex
CREATE INDEX "conciliaciones_financieras_alumnoId_idx" ON "conciliaciones_financieras"("alumnoId");

-- CreateIndex
CREATE INDEX "conciliaciones_financieras_fecha_idx" ON "conciliaciones_financieras"("fecha");

-- CreateIndex
CREATE INDEX "conciliaciones_financieras_empresaId_fecha_idx" ON "conciliaciones_financieras"("empresaId", "fecha");

-- AddForeignKey
ALTER TABLE "conciliaciones_financieras" ADD CONSTRAINT "conciliaciones_financieras_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliaciones_financieras" ADD CONSTRAINT "conciliaciones_financieras_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
