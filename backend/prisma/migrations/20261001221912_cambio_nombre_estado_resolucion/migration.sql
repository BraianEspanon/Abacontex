/*
  Warnings:

  - The values [COMPLETADA] on the enum `EstadoResolucionEjercicio` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoResolucionEjercicio_new" AS ENUM ('PENDIENTE', 'EN_EDICION', 'RESUELTO');
ALTER TABLE "public"."resoluciones_docente" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "public"."resoluciones_docente_plantillas" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "resoluciones_docente" ALTER COLUMN "estado" TYPE "EstadoResolucionEjercicio_new" USING ("estado"::text::"EstadoResolucionEjercicio_new");
ALTER TABLE "resoluciones_docente_plantillas" ALTER COLUMN "estado" TYPE "EstadoResolucionEjercicio_new" USING ("estado"::text::"EstadoResolucionEjercicio_new");
ALTER TYPE "EstadoResolucionEjercicio" RENAME TO "EstadoResolucionEjercicio_old";
ALTER TYPE "EstadoResolucionEjercicio_new" RENAME TO "EstadoResolucionEjercicio";
DROP TYPE "public"."EstadoResolucionEjercicio_old";
ALTER TABLE "resoluciones_docente" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
ALTER TABLE "resoluciones_docente_plantillas" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;
