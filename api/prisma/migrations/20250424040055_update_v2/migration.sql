-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_data_provider_id_fkey" FOREIGN KEY ("data_provider_id") REFERENCES "data_provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
