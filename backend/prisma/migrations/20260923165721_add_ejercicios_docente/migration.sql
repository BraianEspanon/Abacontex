-- CreateEnum
CREATE TYPE "EstadoEjercicio" AS ENUM ('BORRADOR', 'PUBLICADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoPlantillaEjercicio" AS ENUM ('LIBRO_DIARIO', 'LIBRO_MAYOR', 'LIBRO_IVA', 'HOJA_TRABAJO');

-- CreateEnum
CREATE TYPE "TipoEjercicioIA" AS ENUM ('COMPRAS_VENTAS_BASICAS', 'OPERACIONES_COMERCIALES_INTEGRADAS', 'AJUSTES_HOJA_TRABAJO', 'COSTOS_PROCESO_PRODUCTIVO');

-- CreateEnum
CREATE TYPE "DificultadEjercicio" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- CreateEnum
CREATE TYPE "ContenidoAdicionalIA" AS ENUM ('IVA', 'DESCUENTOS', 'INTERESES');

-- CreateEnum
CREATE TYPE "EstadoResolucionEjercicio" AS ENUM ('PENDIENTE', 'EN_EDICION', 'COMPLETADA');

-- CreateTable
CREATE TABLE "ejercicios" (
    "idEjercicio" SERIAL NOT NULL,
    "docenteId" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "enunciado" TEXT NOT NULL,
    "estado" "EstadoEjercicio" NOT NULL DEFAULT 'BORRADOR',
    "indicaciones" VARCHAR(200),
    "fechaLimite" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("idEjercicio")
);

-- CreateTable
CREATE TABLE "ejercicios_plantillas" (
    "idEjercicioPlantilla" SERIAL NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "tipo" "TipoPlantillaEjercicio" NOT NULL,

    CONSTRAINT "ejercicios_plantillas_pkey" PRIMARY KEY ("idEjercicioPlantilla")
);

-- CreateTable
CREATE TABLE "generaciones_ejercicios_ia" (
    "idGeneracion" SERIAL NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "tipoEjercicio" "TipoEjercicioIA" NOT NULL,
    "dificultad" "DificultadEjercicio" NOT NULL,
    "contextoAdicional" VARCHAR(200),

    CONSTRAINT "generaciones_ejercicios_ia_pkey" PRIMARY KEY ("idGeneracion")
);

-- CreateTable
CREATE TABLE "generaciones_ia_contenidos" (
    "idGeneracionContenido" SERIAL NOT NULL,
    "generacionId" INTEGER NOT NULL,
    "contenido" "ContenidoAdicionalIA" NOT NULL,

    CONSTRAINT "generaciones_ia_contenidos_pkey" PRIMARY KEY ("idGeneracionContenido")
);

-- CreateTable
CREATE TABLE "resoluciones_docente" (
    "idResolucion" SERIAL NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "estado" "EstadoResolucionEjercicio" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "resoluciones_docente_pkey" PRIMARY KEY ("idResolucion")
);

-- CreateTable
CREATE TABLE "resoluciones_docente_plantillas" (
    "idResolucionPlantilla" SERIAL NOT NULL,
    "resolucionId" INTEGER NOT NULL,
    "ejercicioPlantillaId" INTEGER NOT NULL,
    "estado" "EstadoResolucionEjercicio" NOT NULL DEFAULT 'PENDIENTE',
    "contenido" JSONB,

    CONSTRAINT "resoluciones_docente_plantillas_pkey" PRIMARY KEY ("idResolucionPlantilla")
);

-- CreateIndex
CREATE INDEX "ejercicios_docenteId_idx" ON "ejercicios"("docenteId");

-- CreateIndex
CREATE INDEX "ejercicios_cursoId_idx" ON "ejercicios"("cursoId");

-- CreateIndex
CREATE INDEX "ejercicios_estado_idx" ON "ejercicios"("estado");

-- CreateIndex
CREATE INDEX "ejercicios_fechaLimite_idx" ON "ejercicios"("fechaLimite");

-- CreateIndex
CREATE INDEX "ejercicios_plantillas_ejercicioId_idx" ON "ejercicios_plantillas"("ejercicioId");

-- CreateIndex
CREATE UNIQUE INDEX "ejercicios_plantillas_ejercicioId_tipo_key" ON "ejercicios_plantillas"("ejercicioId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "generaciones_ejercicios_ia_ejercicioId_key" ON "generaciones_ejercicios_ia"("ejercicioId");

-- CreateIndex
CREATE INDEX "generaciones_ia_contenidos_generacionId_idx" ON "generaciones_ia_contenidos"("generacionId");

-- CreateIndex
CREATE UNIQUE INDEX "generaciones_ia_contenidos_generacionId_contenido_key" ON "generaciones_ia_contenidos"("generacionId", "contenido");

-- CreateIndex
CREATE UNIQUE INDEX "resoluciones_docente_ejercicioId_key" ON "resoluciones_docente"("ejercicioId");

-- CreateIndex
CREATE INDEX "resoluciones_docente_plantillas_resolucionId_idx" ON "resoluciones_docente_plantillas"("resolucionId");

-- CreateIndex
CREATE INDEX "resoluciones_docente_plantillas_ejercicioPlantillaId_idx" ON "resoluciones_docente_plantillas"("ejercicioPlantillaId");

-- CreateIndex
CREATE UNIQUE INDEX "resoluciones_docente_plantillas_resolucionId_ejercicioPlant_key" ON "resoluciones_docente_plantillas"("resolucionId", "ejercicioPlantillaId");

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_plantillas" ADD CONSTRAINT "ejercicios_plantillas_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios"("idEjercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generaciones_ejercicios_ia" ADD CONSTRAINT "generaciones_ejercicios_ia_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios"("idEjercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generaciones_ia_contenidos" ADD CONSTRAINT "generaciones_ia_contenidos_generacionId_fkey" FOREIGN KEY ("generacionId") REFERENCES "generaciones_ejercicios_ia"("idGeneracion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resoluciones_docente" ADD CONSTRAINT "resoluciones_docente_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios"("idEjercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resoluciones_docente_plantillas" ADD CONSTRAINT "resoluciones_docente_plantillas_resolucionId_fkey" FOREIGN KEY ("resolucionId") REFERENCES "resoluciones_docente"("idResolucion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resoluciones_docente_plantillas" ADD CONSTRAINT "resoluciones_docente_plantillas_ejercicioPlantillaId_fkey" FOREIGN KEY ("ejercicioPlantillaId") REFERENCES "ejercicios_plantillas"("idEjercicioPlantilla") ON DELETE CASCADE ON UPDATE CASCADE;
