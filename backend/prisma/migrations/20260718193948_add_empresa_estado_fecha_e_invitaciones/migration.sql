-- CreateEnum
CREATE TYPE "EstadoInvitacion" AS ENUM ('PENDIENTE', 'ACEPTADA', 'CANCELADA', 'EXPIRADA');

-- CreateTable
CREATE TABLE "invitaciones_empresa" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "estado" "EstadoInvitacion" NOT NULL DEFAULT 'PENDIENTE',
    "fechaExpiracion" TIMESTAMPTZ(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "invitaciones_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitaciones_empresa_token_key" ON "invitaciones_empresa"("token");

-- CreateIndex
CREATE INDEX "invitaciones_empresa_empresaId_idx" ON "invitaciones_empresa"("empresaId");

-- CreateIndex
CREATE INDEX "invitaciones_empresa_email_idx" ON "invitaciones_empresa"("email");

-- CreateIndex
CREATE INDEX "invitaciones_empresa_estado_idx" ON "invitaciones_empresa"("estado");

-- CreateIndex
CREATE INDEX "invitaciones_empresa_createdById_idx" ON "invitaciones_empresa"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "invitaciones_empresa_empresaId_email_key" ON "invitaciones_empresa"("empresaId", "email");

-- AddForeignKey
ALTER TABLE "invitaciones_empresa" ADD CONSTRAINT "invitaciones_empresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitaciones_empresa" ADD CONSTRAINT "invitaciones_empresa_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
