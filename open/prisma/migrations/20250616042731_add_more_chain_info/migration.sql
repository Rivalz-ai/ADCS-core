-- AlterTable
ALTER TABLE "chain" ADD COLUMN     "docs_url" TEXT,
ADD COLUMN     "icon_url" TEXT,
ADD COLUMN     "type" "ChainType" NOT NULL DEFAULT 'EVM';
