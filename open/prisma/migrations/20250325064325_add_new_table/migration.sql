-- CreateTable
CREATE TABLE "zeroGUploaded" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rootHash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zeroGUploaded_pkey" PRIMARY KEY ("id")
);
