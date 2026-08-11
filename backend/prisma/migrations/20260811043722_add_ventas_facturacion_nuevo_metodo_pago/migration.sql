-- CreateEnum
CREATE TYPE "TipoAjusteVenta" AS ENUM ('NINGUNO', 'DESCUENTO', 'RECARGO');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('CONFIRMADA');

-- CreateEnum
CREATE TYPE "TipoFactura" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "CondicionFiscal" AS ENUM ('RESPONSABLE_INSCRIPTO', 'CONSUMIDOR_FINAL');

-- CreateTable
CREATE TABLE "ventas" (
    "idVenta" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "metodoPagoId" INTEGER NOT NULL,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'CONFIRMADA',
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "tipoAjuste" "TipoAjusteVenta" NOT NULL DEFAULT 'NINGUNO',
    "porcentajeAjuste" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "importeAjuste" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "aplicaIva" BOOLEAN NOT NULL DEFAULT false,
    "importeIva" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cantidadCuotas" INTEGER,
    "porcentajeInteres" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "importeInteres" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalFinal" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "detalles_venta" (
    "idDetalleVenta" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "detalles_venta_pkey" PRIMARY KEY ("idDetalleVenta")
);

-- CreateTable
CREATE TABLE "facturas" (
    "idFactura" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "tipoFactura" "TipoFactura" NOT NULL,
    "condicionFiscal" "CondicionFiscal" NOT NULL,
    "fechaEmision" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("idFactura")
);

-- CreateTable
CREATE TABLE "metodos_pago_curso" (
    "idMetodoPago" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,

    CONSTRAINT "metodos_pago_curso_pkey" PRIMARY KEY ("idMetodoPago","año")
);

-- CreateIndex
CREATE UNIQUE INDEX "ventas_pedidoId_key" ON "ventas"("pedidoId");

-- CreateIndex
CREATE INDEX "ventas_empresaId_idx" ON "ventas"("empresaId");

-- CreateIndex
CREATE INDEX "ventas_pedidoId_idx" ON "ventas"("pedidoId");

-- CreateIndex
CREATE INDEX "ventas_usuarioId_idx" ON "ventas"("usuarioId");

-- CreateIndex
CREATE INDEX "ventas_metodoPagoId_idx" ON "ventas"("metodoPagoId");

-- CreateIndex
CREATE INDEX "ventas_estado_idx" ON "ventas"("estado");

-- CreateIndex
CREATE INDEX "ventas_fecha_idx" ON "ventas"("fecha");

-- CreateIndex
CREATE INDEX "ventas_empresaId_fecha_idx" ON "ventas"("empresaId", "fecha");

-- CreateIndex
CREATE INDEX "detalles_venta_ventaId_idx" ON "detalles_venta"("ventaId");

-- CreateIndex
CREATE INDEX "detalles_venta_productoId_idx" ON "detalles_venta"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_ventaId_key" ON "facturas"("ventaId");

-- CreateIndex
CREATE INDEX "facturas_tipoFactura_idx" ON "facturas"("tipoFactura");

-- CreateIndex
CREATE INDEX "facturas_condicionFiscal_idx" ON "facturas"("condicionFiscal");

-- CreateIndex
CREATE INDEX "facturas_fechaEmision_idx" ON "facturas"("fechaEmision");

-- CreateIndex
CREATE INDEX "metodos_pago_curso_año_idx" ON "metodos_pago_curso"("año");

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("idPedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "metodos_pago"("idMetodoPago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("idVenta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metodos_pago_curso" ADD CONSTRAINT "metodos_pago_curso_idMetodoPago_fkey" FOREIGN KEY ("idMetodoPago") REFERENCES "metodos_pago"("idMetodoPago") ON DELETE CASCADE ON UPDATE CASCADE;
