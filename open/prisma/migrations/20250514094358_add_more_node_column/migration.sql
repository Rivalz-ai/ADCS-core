-- AlterTable
ALTER TABLE "node" ADD COLUMN     "output_name" TEXT,
ALTER COLUMN "method_name" DROP NOT NULL;
