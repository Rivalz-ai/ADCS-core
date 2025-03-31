-- AlterTable
ALTER TABLE "adaptor" ADD COLUMN     "ai_prompt" TEXT;

-- AlterTable
ALTER TABLE "data_provider" ADD COLUMN     "example_body" TEXT,
ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'GET';
