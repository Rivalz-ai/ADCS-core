/*
  Warnings:

  - The primary key for the `adaptor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `adaptor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `output_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `output_type` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category_id` on the `adaptor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `output_type_id` on the `adaptor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "adaptor" DROP CONSTRAINT "adaptor_category_id_fkey";

-- DropForeignKey
ALTER TABLE "adaptor" DROP CONSTRAINT "adaptor_output_type_id_fkey";

-- AlterTable
ALTER TABLE "adaptor" DROP CONSTRAINT "adaptor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
DROP COLUMN "output_type_id",
ADD COLUMN     "output_type_id" INTEGER NOT NULL,
ADD CONSTRAINT "adaptor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "output_type" DROP CONSTRAINT "output_type_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "output_type_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptor" ADD CONSTRAINT "adaptor_output_type_id_fkey" FOREIGN KEY ("output_type_id") REFERENCES "output_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
