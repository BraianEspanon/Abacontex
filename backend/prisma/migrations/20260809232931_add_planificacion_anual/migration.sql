-- CreateEnum
CREATE TYPE "EstadoPlanificacionAnual" AS ENUM ('PENDIENTE', 'CARGADA');

-- CreateTable
CREATE TABLE "planificaciones_anuales" (
    "idPlanificacion" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "cicloLectivoId" INTEGER NOT NULL,
    "mesInicio" INTEGER NOT NULL,
    "mesFin" INTEGER NOT NULL,
    "estado" "EstadoPlanificacionAnual" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "planificaciones_anuales_pkey" PRIMARY KEY ("idPlanificacion")
);

-- CreateTable
CREATE TABLE "detalles_planificacion_anual" (
    "idDetalle" SERIAL NOT NULL,
    "planificacionId" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "unidadesEstimadas" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalles_planificacion_anual_pkey" PRIMARY KEY ("idDetalle")
);

-- CreateIndex
CREATE INDEX "planificaciones_anuales_empresaId_idx" ON "planificaciones_anuales"("empresaId");

-- CreateIndex
CREATE INDEX "planificaciones_anuales_cicloLectivoId_idx" ON "planificaciones_anuales"("cicloLectivoId");

-- CreateIndex
CREATE INDEX "planificaciones_anuales_estado_idx" ON "planificaciones_anuales"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "planificaciones_anuales_empresaId_cicloLectivoId_key" ON "planificaciones_anuales"("empresaId", "cicloLectivoId");

-- CreateIndex
CREATE INDEX "detalles_planificacion_anual_planificacionId_idx" ON "detalles_planificacion_anual"("planificacionId");

-- CreateIndex
CREATE UNIQUE INDEX "detalles_planificacion_anual_planificacionId_mes_key" ON "detalles_planificacion_anual"("planificacionId", "mes");

-- AddForeignKey
ALTER TABLE "planificaciones_anuales" ADD CONSTRAINT "planificaciones_anuales_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificaciones_anuales" ADD CONSTRAINT "planificaciones_anuales_cicloLectivoId_fkey" FOREIGN KEY ("cicloLectivoId") REFERENCES "ciclo_lectivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_planificacion_anual" ADD CONSTRAINT "detalles_planificacion_anual_planificacionId_fkey" FOREIGN KEY ("planificacionId") REFERENCES "planificaciones_anuales"("idPlanificacion") ON DELETE CASCADE ON UPDATE CASCADE;
