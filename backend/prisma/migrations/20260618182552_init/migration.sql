-- CreateTable
CREATE TABLE "ciclo_lectivo" (
    "id" SERIAL NOT NULL,
    "año" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ciclo_lectivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "keycloakId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "rolSistemaId" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "idCurso" SERIAL NOT NULL,
    "nombreCurso" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("idCurso")
);

-- CreateTable
CREATE TABLE "usuario_cursos" (
    "idCurso" INTEGER NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "usuario_cursos_pkey" PRIMARY KEY ("idCurso","idUsuario")
);

-- CreateTable
CREATE TABLE "roles_sistema" (
    "nombreRol" TEXT NOT NULL,
    "descripcion" TEXT,
    "idRol" SERIAL NOT NULL,

    CONSTRAINT "roles_sistema_pkey" PRIMARY KEY ("idRol")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_keycloakId_key" ON "usuarios"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nombreCurso_key" ON "cursos"("nombreCurso");

-- CreateIndex
CREATE UNIQUE INDEX "roles_sistema_nombreRol_key" ON "roles_sistema"("nombreRol");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolSistemaId_fkey" FOREIGN KEY ("rolSistemaId") REFERENCES "roles_sistema"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cursos" ADD CONSTRAINT "usuario_cursos_idCurso_fkey" FOREIGN KEY ("idCurso") REFERENCES "cursos"("idCurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_cursos" ADD CONSTRAINT "usuario_cursos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
