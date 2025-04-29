/*
  Warnings:

  - A unique constraint covering the columns `[pr_url]` on the table `provider_v2` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pr_url` to the `provider_v2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "provider_v2" ADD COLUMN     "pr_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "provider_v2_pr_url_key" ON "provider_v2"("pr_url");
