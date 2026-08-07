-- CreateTable
CREATE TABLE "historial_estado_orden_produccion" (
    "idHistorial" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estado_orden_produccion_pkey" PRIMARY KEY ("idHistorial")
);

-- CreateIndex
CREATE INDEX "historial_estado_orden_produccion_ordenId_idx" ON "historial_estado_orden_produccion"("ordenId");

-- CreateIndex
CREATE INDEX "historial_estado_orden_produccion_estadoId_idx" ON "historial_estado_orden_produccion"("estadoId");

-- CreateIndex
CREATE INDEX "historial_estado_orden_produccion_usuarioId_idx" ON "historial_estado_orden_produccion"("usuarioId");

-- AddForeignKey
ALTER TABLE "historial_estado_orden_produccion" ADD CONSTRAINT "historial_estado_orden_produccion_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_produccion"("idOrden") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estado_orden_produccion" ADD CONSTRAINT "historial_estado_orden_produccion_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estados_orden_produccion"("idEstado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estado_orden_produccion" ADD CONSTRAINT "historial_estado_orden_produccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
