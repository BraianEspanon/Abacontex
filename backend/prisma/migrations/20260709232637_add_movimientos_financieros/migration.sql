-- CreateTable
CREATE TABLE "movimientos_financieros" (
    "idMovimiento" SERIAL NOT NULL,
    "idEmpresa" INTEGER NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "idCategoria" INTEGER NOT NULL,
    "idMetodoPago" INTEGER NOT NULL,
    "idEstado" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concepto" TEXT NOT NULL,
    "importe" DECIMAL(14,2) NOT NULL,
    "esAutomatico" BOOLEAN NOT NULL DEFAULT false,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movimientos_financieros_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateTable
CREATE TABLE "tipos_movimiento" (
    "idTipoMovimiento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "tipos_movimiento_pkey" PRIMARY KEY ("idTipoMovimiento")
);

-- CreateTable
CREATE TABLE "categorias_movimiento" (
    "idCategoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "idTipoMovimiento" INTEGER NOT NULL,

    CONSTRAINT "categorias_movimiento_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "idMetodoPago" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("idMetodoPago")
);

-- CreateTable
CREATE TABLE "estados_movimiento" (
    "idEstado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estados_movimiento_pkey" PRIMARY KEY ("idEstado")
);

-- CreateIndex
CREATE INDEX "movimientos_financieros_idEmpresa_idx" ON "movimientos_financieros"("idEmpresa");

-- CreateIndex
CREATE INDEX "movimientos_financieros_idUsuario_idx" ON "movimientos_financieros"("idUsuario");

-- CreateIndex
CREATE INDEX "movimientos_financieros_idCategoria_idx" ON "movimientos_financieros"("idCategoria");

-- CreateIndex
CREATE INDEX "movimientos_financieros_idMetodoPago_idx" ON "movimientos_financieros"("idMetodoPago");

-- CreateIndex
CREATE INDEX "movimientos_financieros_idEstado_idx" ON "movimientos_financieros"("idEstado");

-- CreateIndex
CREATE INDEX "movimientos_financieros_fecha_idx" ON "movimientos_financieros"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_movimiento_nombre_key" ON "tipos_movimiento"("nombre");

-- CreateIndex
CREATE INDEX "categorias_movimiento_idTipoMovimiento_idx" ON "categorias_movimiento"("idTipoMovimiento");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_pago_nombre_key" ON "metodos_pago"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_movimiento_nombre_key" ON "estados_movimiento"("nombre");

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_idEmpresa_fkey" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "categorias_movimiento"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_idMetodoPago_fkey" FOREIGN KEY ("idMetodoPago") REFERENCES "metodos_pago"("idMetodoPago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "movimientos_financieros_idEstado_fkey" FOREIGN KEY ("idEstado") REFERENCES "estados_movimiento"("idEstado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_movimiento" ADD CONSTRAINT "categorias_movimiento_idTipoMovimiento_fkey" FOREIGN KEY ("idTipoMovimiento") REFERENCES "tipos_movimiento"("idTipoMovimiento") ON DELETE RESTRICT ON UPDATE CASCADE;
