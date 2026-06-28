-- AlterTable
ALTER TABLE "Child" ADD COLUMN "identity_search_tokens" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
