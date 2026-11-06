-- CreateEnum
CREATE TYPE "EstadoSimulacion" AS ENUM ('BORRADOR', 'PUBLICADA');

-- CreateEnum
CREATE TYPE "EstadoParticipacionSimulacion" AS ENUM ('PENDIENTE', 'EN_CURSO', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "DificultadSimulacion" AS ENUM ('BASICA', 'INTERMEDIA', 'AVANZADA');

-- CreateEnum
CREATE TYPE "DuracionSimulacion" AS ENUM ('CORTA', 'MEDIA', 'LARGA');

-- CreateEnum
CREATE TYPE "TipoEventoSimulacion" AS ENUM ('DECISION', 'INFORMATIVO', 'FINAL');

-- CreateEnum
CREATE TYPE "ClasificacionOpcionSimulacion" AS ENUM ('MUY_ADECUADA', 'ADECUADA', 'POCO_ADECUADA', 'INADECUADA');

-- CreateTable
CREATE TABLE "simulaciones" (
    "idSimulacion" SERIAL NOT NULL,
    "docenteId" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "flujoEmpresarial" VARCHAR(100) NOT NULL,
    "dificultad" "DificultadSimulacion" NOT NULL,
    "duracion" "DuracionSimulacion" NOT NULL,
    "eventosSorpresa" BOOLEAN NOT NULL,
    "usarDatosEmpresa" BOOLEAN NOT NULL,
    "fechaLimite" TIMESTAMPTZ(3) NOT NULL,
    "estado" "EstadoSimulacion" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "simulaciones_pkey" PRIMARY KEY ("idSimulacion")
);

-- CreateTable
CREATE TABLE "simulaciones_empresas" (
    "idSimulacionEmpresa" SERIAL NOT NULL,
    "simulacionId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "estado" "EstadoParticipacionSimulacion" NOT NULL DEFAULT 'PENDIENTE',
    "situacionInicial" TEXT NOT NULL,
    "eventoInicialId" INTEGER,
    "eventoActualId" INTEGER,
    "fechaInicio" TIMESTAMPTZ(3),
    "fechaFinalizacion" TIMESTAMPTZ(3),
    "puntajeFinal" INTEGER,
    "feedbackFinal" JSONB,

    CONSTRAINT "simulaciones_empresas_pkey" PRIMARY KEY ("idSimulacionEmpresa")
);

-- CreateTable
CREATE TABLE "eventos_simulacion" (
    "idEvento" SERIAL NOT NULL,
    "simulacionEmpresaId" INTEGER NOT NULL,
    "codigoEvento" VARCHAR(30) NOT NULL,
    "tipo" "TipoEventoSimulacion" NOT NULL,
    "emisor" VARCHAR(50) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "esSorpresa" BOOLEAN NOT NULL DEFAULT false,
    "rolesHabilitados" JSONB,
    "siguienteEventoId" INTEGER,

    CONSTRAINT "eventos_simulacion_pkey" PRIMARY KEY ("idEvento")
);

-- CreateTable
CREATE TABLE "opciones_eventos_simulacion" (
    "idOpcion" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "codigoOpcion" VARCHAR(30) NOT NULL,
    "texto" TEXT NOT NULL,
    "clasificacion" "ClasificacionOpcionSimulacion" NOT NULL,
    "siguienteEventoId" INTEGER,
    "cambiosSimulados" JSONB,

    CONSTRAINT "opciones_eventos_simulacion_pkey" PRIMARY KEY ("idOpcion")
);

-- CreateTable
CREATE TABLE "decisiones_simulacion" (
    "idDecision" SERIAL NOT NULL,
    "simulacionEmpresaId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "opcionId" INTEGER NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "rolEmpresaId" INTEGER NOT NULL,
    "puntosObtenidos" INTEGER NOT NULL,
    "fechaDecision" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisiones_simulacion_pkey" PRIMARY KEY ("idDecision")
);

-- CreateTable
CREATE TABLE "estados_simulacion_empresa" (
    "idEstado" SERIAL NOT NULL,
    "simulacionEmpresaId" INTEGER NOT NULL,
    "variables" JSONB NOT NULL,
    "historialEventos" JSONB NOT NULL,

    CONSTRAINT "estados_simulacion_empresa_pkey" PRIMARY KEY ("idEstado")
);

-- CreateIndex
CREATE INDEX "simulaciones_docenteId_idx" ON "simulaciones"("docenteId");

-- CreateIndex
CREATE INDEX "simulaciones_cursoId_idx" ON "simulaciones"("cursoId");

-- CreateIndex
CREATE INDEX "simulaciones_estado_idx" ON "simulaciones"("estado");

-- CreateIndex
CREATE INDEX "simulaciones_fechaLimite_idx" ON "simulaciones"("fechaLimite");

-- CreateIndex
CREATE UNIQUE INDEX "simulaciones_empresas_eventoInicialId_key" ON "simulaciones_empresas"("eventoInicialId");

-- CreateIndex
CREATE UNIQUE INDEX "simulaciones_empresas_eventoActualId_key" ON "simulaciones_empresas"("eventoActualId");

-- CreateIndex
CREATE INDEX "simulaciones_empresas_simulacionId_idx" ON "simulaciones_empresas"("simulacionId");

-- CreateIndex
CREATE INDEX "simulaciones_empresas_empresaId_idx" ON "simulaciones_empresas"("empresaId");

-- CreateIndex
CREATE INDEX "simulaciones_empresas_estado_idx" ON "simulaciones_empresas"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "simulaciones_empresas_simulacionId_empresaId_key" ON "simulaciones_empresas"("simulacionId", "empresaId");

-- CreateIndex
CREATE INDEX "eventos_simulacion_simulacionEmpresaId_idx" ON "eventos_simulacion"("simulacionEmpresaId");

-- CreateIndex
CREATE INDEX "eventos_simulacion_siguienteEventoId_idx" ON "eventos_simulacion"("siguienteEventoId");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_simulacion_simulacionEmpresaId_codigoEvento_key" ON "eventos_simulacion"("simulacionEmpresaId", "codigoEvento");

-- CreateIndex
CREATE INDEX "opciones_eventos_simulacion_eventoId_idx" ON "opciones_eventos_simulacion"("eventoId");

-- CreateIndex
CREATE INDEX "opciones_eventos_simulacion_siguienteEventoId_idx" ON "opciones_eventos_simulacion"("siguienteEventoId");

-- CreateIndex
CREATE UNIQUE INDEX "opciones_eventos_simulacion_eventoId_codigoOpcion_key" ON "opciones_eventos_simulacion"("eventoId", "codigoOpcion");

-- CreateIndex
CREATE INDEX "decisiones_simulacion_simulacionEmpresaId_idx" ON "decisiones_simulacion"("simulacionEmpresaId");

-- CreateIndex
CREATE INDEX "decisiones_simulacion_eventoId_idx" ON "decisiones_simulacion"("eventoId");

-- CreateIndex
CREATE INDEX "decisiones_simulacion_opcionId_idx" ON "decisiones_simulacion"("opcionId");

-- CreateIndex
CREATE INDEX "decisiones_simulacion_alumnoId_idx" ON "decisiones_simulacion"("alumnoId");

-- CreateIndex
CREATE INDEX "decisiones_simulacion_rolEmpresaId_idx" ON "decisiones_simulacion"("rolEmpresaId");

-- CreateIndex
CREATE UNIQUE INDEX "decisiones_simulacion_simulacionEmpresaId_eventoId_key" ON "decisiones_simulacion"("simulacionEmpresaId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "estados_simulacion_empresa_simulacionEmpresaId_key" ON "estados_simulacion_empresa"("simulacionEmpresaId");

-- AddForeignKey
ALTER TABLE "simulaciones" ADD CONSTRAINT "simulaciones_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulaciones" ADD CONSTRAINT "simulaciones_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulaciones_empresas" ADD CONSTRAINT "simulaciones_empresas_simulacionId_fkey" FOREIGN KEY ("simulacionId") REFERENCES "simulaciones"("idSimulacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulaciones_empresas" ADD CONSTRAINT "simulaciones_empresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulaciones_empresas" ADD CONSTRAINT "simulaciones_empresas_eventoInicialId_fkey" FOREIGN KEY ("eventoInicialId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulaciones_empresas" ADD CONSTRAINT "simulaciones_empresas_eventoActualId_fkey" FOREIGN KEY ("eventoActualId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_simulacion" ADD CONSTRAINT "eventos_simulacion_simulacionEmpresaId_fkey" FOREIGN KEY ("simulacionEmpresaId") REFERENCES "simulaciones_empresas"("idSimulacionEmpresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_simulacion" ADD CONSTRAINT "eventos_simulacion_siguienteEventoId_fkey" FOREIGN KEY ("siguienteEventoId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_eventos_simulacion" ADD CONSTRAINT "opciones_eventos_simulacion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_eventos_simulacion" ADD CONSTRAINT "opciones_eventos_simulacion_siguienteEventoId_fkey" FOREIGN KEY ("siguienteEventoId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_simulacion" ADD CONSTRAINT "decisiones_simulacion_simulacionEmpresaId_fkey" FOREIGN KEY ("simulacionEmpresaId") REFERENCES "simulaciones_empresas"("idSimulacionEmpresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_simulacion" ADD CONSTRAINT "decisiones_simulacion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos_simulacion"("idEvento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_simulacion" ADD CONSTRAINT "decisiones_simulacion_opcionId_fkey" FOREIGN KEY ("opcionId") REFERENCES "opciones_eventos_simulacion"("idOpcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_simulacion" ADD CONSTRAINT "decisiones_simulacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisiones_simulacion" ADD CONSTRAINT "decisiones_simulacion_rolEmpresaId_fkey" FOREIGN KEY ("rolEmpresaId") REFERENCES "roles_empresa"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados_simulacion_empresa" ADD CONSTRAINT "estados_simulacion_empresa_simulacionEmpresaId_fkey" FOREIGN KEY ("simulacionEmpresaId") REFERENCES "simulaciones_empresas"("idSimulacionEmpresa") ON DELETE CASCADE ON UPDATE CASCADE;
