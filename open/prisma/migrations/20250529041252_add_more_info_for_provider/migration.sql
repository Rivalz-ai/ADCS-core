-- AlterTable
ALTER TABLE "category" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'adaptor';

-- AlterTable
ALTER TABLE "provider_v2" ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "request_count" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "provider_v2" ADD CONSTRAINT "provider_v2_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
