-- Retiro: tres fotos obligatorias (cédula, persona, documento de parentesco)
ALTER TABLE "Child" ADD COLUMN "retiro_foto_cedula_url" TEXT;
ALTER TABLE "Child" ADD COLUMN "retiro_foto_persona_url" TEXT;
ALTER TABLE "Child" ADD COLUMN "retiro_foto_parentesco_url" TEXT;

UPDATE "Child"
SET "retiro_foto_persona_url" = "retiro_foto_url"
WHERE "retiro_foto_url" IS NOT NULL;

ALTER TABLE "Child" DROP COLUMN "retiro_foto_url";
