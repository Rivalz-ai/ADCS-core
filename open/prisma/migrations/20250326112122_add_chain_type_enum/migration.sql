-- CreateEnum
CREATE TYPE "ChainType" AS ENUM ('EVM', 'NON_EVM');

-- AlterTable
ALTER TABLE "adaptor" ADD COLUMN     "chainType" "ChainType" NOT NULL DEFAULT 'EVM';
