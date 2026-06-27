-- CreateEnum
CREATE TYPE "ChildStatus" AS ENUM ('Buscando', 'Reencontrado');

-- CreateEnum
CREATE TYPE "EstadoVital" AS ENUM ('ConVida', 'Fallecido');

-- AlterTable: edad_anios
ALTER TABLE "Child" ADD COLUMN "edad_anios" INTEGER;

UPDATE "Child"
SET "edad_anios" = COALESCE(
  NULLIF(substring("edad_estimada" FROM '^([0-9]+)')::INTEGER, NULL),
  5
);

ALTER TABLE "Child" ALTER COLUMN "edad_anios" SET NOT NULL;

-- AlterTable: estado_vital
ALTER TABLE "Child" ADD COLUMN "estado_vital" "EstadoVital" NOT NULL DEFAULT 'ConVida';

-- AlterTable: status to enum
ALTER TABLE "Child" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Child" ALTER COLUMN "status" TYPE "ChildStatus" USING ("status"::text::"ChildStatus");
ALTER TABLE "Child" ALTER COLUMN "status" SET DEFAULT 'Buscando'::"ChildStatus";

-- CreateIndex
CREATE INDEX "Child_estado_vital_idx" ON "Child"("estado_vital");

-- CreateIndex
CREATE INDEX "Child_edad_anios_idx" ON "Child"("edad_anios");
