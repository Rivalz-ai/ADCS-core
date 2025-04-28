-- CreateTable
CREATE TABLE "chain_rpc" (
    "id" SERIAL NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "rpc_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chain_rpc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chain_rpc" ADD CONSTRAINT "chain_rpc_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
