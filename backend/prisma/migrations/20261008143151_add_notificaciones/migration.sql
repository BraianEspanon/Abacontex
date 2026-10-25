-- CreateTable
CREATE TABLE "notificaciones" (
    "idNotificacion" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "ejercicioId" INTEGER,
    "titulo" VARCHAR(100) NOT NULL,
    "mensaje" VARCHAR(255) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("idNotificacion")
);

-- CreateIndex
CREATE INDEX "notificaciones_usuarioId_idx" ON "notificaciones"("usuarioId");

-- CreateIndex
CREATE INDEX "notificaciones_ejercicioId_idx" ON "notificaciones"("ejercicioId");

-- CreateIndex
CREATE INDEX "notificaciones_usuarioId_leida_idx" ON "notificaciones"("usuarioId", "leida");

-- CreateIndex
CREATE INDEX "notificaciones_createdAt_idx" ON "notificaciones"("createdAt");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "ejercicios"("idEjercicio") ON DELETE SET NULL ON UPDATE CASCADE;
