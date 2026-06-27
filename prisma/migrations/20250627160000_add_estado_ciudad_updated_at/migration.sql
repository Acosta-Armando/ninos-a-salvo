-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'Sucre',
ADD COLUMN     "ciudad" TEXT NOT NULL DEFAULT 'Sucre',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Child_estado_idx" ON "Child"("estado");

-- CreateIndex
CREATE INDEX "Child_ciudad_idx" ON "Child"("ciudad");

-- CreateIndex
CREATE INDEX "Child_fullname_idx" ON "Child"("fullname");

-- Remove defaults after backfill (optional - keep defaults for migration safety)
ALTER TABLE "Child" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Child" ALTER COLUMN "ciudad" DROP DEFAULT;
