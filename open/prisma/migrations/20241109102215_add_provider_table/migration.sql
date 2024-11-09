-- AlterTable
ALTER TABLE "adaptor" ADD COLUMN     "adaptorTypeId" INTEGER,
ADD COLUMN     "data_provider_id" INTEGER,
ADD COLUMN     "type_id" INTEGER;

-- CreateTable
CREATE TABLE "adaptor_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptor_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inputVariables" TEXT NOT NULL,
    "outputVariables" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "api_key" TEXT,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_provider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_adaptorTypeId_fkey" FOREIGN KEY ("adaptorTypeId") REFERENCES "adaptor_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_data_provider_id_fkey" FOREIGN KEY ("data_provider_id") REFERENCES "data_provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
