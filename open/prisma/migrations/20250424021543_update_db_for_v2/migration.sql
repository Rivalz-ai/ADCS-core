-- DropForeignKey
ALTER TABLE "adaptor" DROP CONSTRAINT "adaptor_data_provider_id_fkey";

-- CreateTable
CREATE TABLE "entity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "object" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "node_type" TEXT NOT NULL,
    "method_name" TEXT NOT NULL,
    "method_id" INTEGER,
    "input_values" TEXT NOT NULL,
    "adaptor_id" INTEGER,
    "index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_v2" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "base_url" TEXT NOT NULL,
    "api_key" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_method" (
    "id" SERIAL NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "method_name" TEXT NOT NULL,
    "method_type" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "input_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "playground_url" TEXT,
    "input_entity_id" INTEGER NOT NULL,
    "output_entity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adaptor_v2" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "input_entity_id" INTEGER NOT NULL,
    "output_entity_id" INTEGER NOT NULL,
    "core_llm" TEXT,
    "static_context" TEXT,
    "nodes_definition" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptor_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_api_key" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "api_key" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_api_key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_v2_code_key" ON "provider_v2"("code");

-- CreateIndex
CREATE UNIQUE INDEX "adaptor_v2_code_key" ON "adaptor_v2"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_key_api_key_key" ON "user_api_key"("api_key");

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_method_id_fkey" FOREIGN KEY ("method_id") REFERENCES "provider_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_adaptor_id_fkey" FOREIGN KEY ("adaptor_id") REFERENCES "adaptor_v2"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_method" ADD CONSTRAINT "provider_method_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_v2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_method" ADD CONSTRAINT "provider_method_input_entity_id_fkey" FOREIGN KEY ("input_entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_method" ADD CONSTRAINT "provider_method_output_entity_id_fkey" FOREIGN KEY ("output_entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptor_v2" ADD CONSTRAINT "adaptor_v2_input_entity_id_fkey" FOREIGN KEY ("input_entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptor_v2" ADD CONSTRAINT "adaptor_v2_output_entity_id_fkey" FOREIGN KEY ("output_entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
