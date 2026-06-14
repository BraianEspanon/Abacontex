-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_sistema" (
    "id" SERIAL NOT NULL,
    "nombreRol" TEXT NOT NULL,

    CONSTRAINT "roles_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "keycloakId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cursoId" INTEGER,
    "rolSistemaId" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nombre_key" ON "cursos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "roles_sistema_nombreRol_key" ON "roles_sistema"("nombreRol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_keycloakId_key" ON "usuarios"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolSistemaId_fkey" FOREIGN KEY ("rolSistemaId") REFERENCES "roles_sistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
