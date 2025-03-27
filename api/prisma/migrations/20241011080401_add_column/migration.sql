-- AlterTable
ALTER TABLE "adaptor" ADD COLUMN     "chain_id" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "requests" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
