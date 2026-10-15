-- CreateEnum
CREATE TYPE "EstadoResolucionAlumnoPlantilla" AS ENUM ('PENDIENTE', 'EN_EDICION', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "EstadoCorreccionPlantilla" AS ENUM ('PENDIENTE', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "TipoErrorCorreccion" AS ENUM ('CUENTA_INCORRECTA', 'TIPO_MOVIMIENTO_INCORRECTO', 'IMPORTE_INCORRECTO', 'DEBE_HABER_INVERTIDO', 'CUENTA_OMITIDA', 'CUENTA_ADICIONAL', 'CUENTA_MAYORIZAR_OMITIDA', 'SALDO_FINAL_INCORRECTO', 'TIPO_SALDO_INCORRECTO', 'COMPROBANTE_OMITIDO', 'COMPROBANTE_ADICIONAL', 'FECHA_INCORRECTA', 'CLASIFICACION_SALDO_INCORRECTA', 'RESULTADO_EJERCICIO_INCORRECTO', 'RESULTADO_EJERCICIO_INCOMPLETO');

-- CreateTable
CREATE TABLE "entregas_ejercicios" (
    "idEntrega" SERIAL NOT NULL,
    "ejercicioId" INTEGER NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "fechaEntrega" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "entregas_ejercicios_pkey" PRIMARY KEY ("idEntrega")
);

-- CreateTable
CREATE TABLE "resoluciones_alumno_plantillas" (
    "idResolucionPlantilla" SERIAL NOT NULL,
    "entregaId" INTEGER NOT NULL,
    "ejercicioPlantillaId" INTEGER NOT NULL,
    "estado" "EstadoResolucionAlumnoPlantilla" NOT NULL DEFAULT 'PENDIENTE',
    "contenido" JSONB,

    CONSTRAINT "resoluciones_alumno_plantillas_pkey" PRIMARY KEY ("idResolucionPlantilla")
);

-- CreateTable
CREATE TABLE "correcciones_entregas" (
    "idCorreccion" SERIAL NOT NULL,
    "entregaId" INTEGER NOT NULL,
    "docenteId" TEXT NOT NULL,
    "retroalimentacion" TEXT,
    "fechaCorreccion" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "correcciones_entregas_pkey" PRIMARY KEY ("idCorreccion")
);

-- CreateTable
CREATE TABLE "correcciones_plantillas" (
    "idCorreccionPlantilla" SERIAL NOT NULL,
    "correccionId" INTEGER NOT NULL,
    "ejercicioPlantillaId" INTEGER NOT NULL,
    "estado" "EstadoCorreccionPlantilla" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "correcciones_plantillas_pkey" PRIMARY KEY ("idCorreccionPlantilla")
);

-- CreateTable
CREATE TABLE "errores_correcciones" (
    "idError" SERIAL NOT NULL,
    "correccionId" INTEGER NOT NULL,
    "ejercicioPlantillaId" INTEGER NOT NULL,
    "tipoError" "TipoErrorCorreccion" NOT NULL,
    "detalle" JSONB NOT NULL,
    "comentarioDocente" VARCHAR(255),

    CONSTRAINT "errores_correcciones_pkey" PRIMARY KEY ("idError")
);

-- CreateIndex
CREATE INDEX "entregas_ejercicios_ejercicioId_idx" ON "entregas_ejercicios"("ejercicioId");

-- CreateIndex
CREATE INDEX "entregas_ejercicios_alumnoId_idx" ON "entregas_ejercicios"("alumnoId");

-- CreateIndex
CREATE INDEX "entregas_ejercicios_fechaEntrega_idx" ON "entregas_ejercicios"("fechaEntrega");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_ejercicios_ejercicioId_alumnoId_key" ON "entregas_ejercicios"("ejercicioId", "alumnoId");

-- CreateIndex
CREATE INDEX "resoluciones_alumno_plantillas_entregaId_idx" ON "resoluciones_alumno_plantillas"("entregaId");

-- CreateIndex
CREATE INDEX "resoluciones_alumno_plantillas_ejercicioPlantillaId_idx" ON "resoluciones_alumno_plantillas"("ejercicioPlantillaId");

-- CreateIndex
CREATE UNIQUE INDEX "resoluciones_alumno_plantillas_entregaId_ejercicioPlantilla_key" ON "resoluciones_alumno_plantillas"("entregaId", "ejercicioPlantillaId");

-- CreateIndex
CREATE UNIQUE INDEX "correcciones_entregas_entregaId_key" ON "correcciones_entregas"("entregaId");

-- CreateIndex
CREATE INDEX "correcciones_entregas_docenteId_idx" ON "correcciones_entregas"("docenteId");

-- CreateIndex
CREATE INDEX "correcciones_entregas_fechaCorreccion_idx" ON "correcciones_entregas"("fechaCorreccion");

-- CreateIndex
CREATE INDEX "correcciones_plantillas_correccionId_idx" ON "correcciones_plantillas"("correccionId");

-- CreateIndex
CREATE INDEX "correcciones_plantillas_ejercicioPlantillaId_idx" ON "correcciones_plantillas"("ejercicioPlantillaId");

-- CreateIndex
CREATE UNIQUE INDEX "correcciones_plantillas_correccionId_ejercicioPlantillaId_key" ON "correcciones_plantillas"("correccionId", "ejercicioPlantillaId");

-- CreateIndex
CREATE INDEX "errores_correcciones_correccionId_idx" ON "errores_correcciones"("correccionId");

-- CreateIndex
CREATE INDEX "errores_correcciones_ejercicioPlantillaId_idx" ON "errores_correcciones"("ejercicioPlantillaId");

-- CreateIndex
CREATE INDEX "errores_correcciones_tipoError_idx" ON "errores_correcciones"("tipoError");

-- AddForeignKey
ALTER TABLE "entregas_ejercicios" ADD CONSTRAINT "entregas_ejercicios_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios"("idEjercicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_ejercicios" ADD CONSTRAINT "entregas_ejercicios_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resoluciones_alumno_plantillas" ADD CONSTRAINT "resoluciones_alumno_plantillas_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "entregas_ejercicios"("idEntrega") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resoluciones_alumno_plantillas" ADD CONSTRAINT "resoluciones_alumno_plantillas_ejercicioPlantillaId_fkey" FOREIGN KEY ("ejercicioPlantillaId") REFERENCES "ejercicios_plantillas"("idEjercicioPlantilla") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_entregas" ADD CONSTRAINT "correcciones_entregas_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "entregas_ejercicios"("idEntrega") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_entregas" ADD CONSTRAINT "correcciones_entregas_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_plantillas" ADD CONSTRAINT "correcciones_plantillas_correccionId_fkey" FOREIGN KEY ("correccionId") REFERENCES "correcciones_entregas"("idCorreccion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_plantillas" ADD CONSTRAINT "correcciones_plantillas_ejercicioPlantillaId_fkey" FOREIGN KEY ("ejercicioPlantillaId") REFERENCES "ejercicios_plantillas"("idEjercicioPlantilla") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errores_correcciones" ADD CONSTRAINT "errores_correcciones_correccionId_fkey" FOREIGN KEY ("correccionId") REFERENCES "correcciones_entregas"("idCorreccion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errores_correcciones" ADD CONSTRAINT "errores_correcciones_ejercicioPlantillaId_fkey" FOREIGN KEY ("ejercicioPlantillaId") REFERENCES "ejercicios_plantillas"("idEjercicioPlantilla") ON DELETE CASCADE ON UPDATE CASCADE;
