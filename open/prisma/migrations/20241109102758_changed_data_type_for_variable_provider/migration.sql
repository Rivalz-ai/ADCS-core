/*
  Warnings:

  - Changed the type of `inputVariables` on the `data_provider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `outputVariables` on the `data_provider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "data_provider" DROP COLUMN "inputVariables",
ADD COLUMN     "inputVariables" JSONB NOT NULL,
DROP COLUMN "outputVariables",
ADD COLUMN     "outputVariables" JSONB NOT NULL;
