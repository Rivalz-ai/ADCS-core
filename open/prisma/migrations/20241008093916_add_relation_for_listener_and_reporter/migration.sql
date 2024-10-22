-- AddForeignKey
ALTER TABLE "listener" ADD CONSTRAINT "listener_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listener" ADD CONSTRAINT "listener_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporter" ADD CONSTRAINT "reporter_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporter" ADD CONSTRAINT "reporter_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
