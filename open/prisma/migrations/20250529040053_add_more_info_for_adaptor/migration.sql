-- AlterTable
ALTER TABLE "adaptor_v2" ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "output_type_id" INTEGER,
ADD COLUMN     "request_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AddForeignKey
ALTER TABLE "adaptor_v2" ADD CONSTRAINT "adaptor_v2_output_type_id_fkey" FOREIGN KEY ("output_type_id") REFERENCES "output_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptor_v2" ADD CONSTRAINT "adaptor_v2_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
