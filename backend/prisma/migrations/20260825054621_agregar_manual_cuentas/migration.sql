-- CreateTable
CREATE TABLE "tipos_cuenta_contable" (
    "idTipoCuenta" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "tipos_cuenta_contable_pkey" PRIMARY KEY ("idTipoCuenta")
);

-- CreateTable
CREATE TABLE "cuentas_contables" (
    "idCuenta" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "idTipoCuenta" INTEGER NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cuentas_contables_pkey" PRIMARY KEY ("idCuenta")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipos_cuenta_contable_nombre_key" ON "tipos_cuenta_contable"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_contables_codigo_key" ON "cuentas_contables"("codigo");

-- CreateIndex
CREATE INDEX "cuentas_contables_idTipoCuenta_idx" ON "cuentas_contables"("idTipoCuenta");

-- CreateIndex
CREATE INDEX "cuentas_contables_activo_idx" ON "cuentas_contables"("activo");

-- CreateIndex
CREATE INDEX "cuentas_contables_nombre_idx" ON "cuentas_contables"("nombre");

-- AddForeignKey
ALTER TABLE "cuentas_contables" ADD CONSTRAINT "cuentas_contables_idTipoCuenta_fkey" FOREIGN KEY ("idTipoCuenta") REFERENCES "tipos_cuenta_contable"("idTipoCuenta") ON DELETE RESTRICT ON UPDATE CASCADE;
