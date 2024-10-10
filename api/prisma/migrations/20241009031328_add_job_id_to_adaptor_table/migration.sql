/*
  Warnings:

  - Added the required column `job_id` to the `adaptor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adaptor" ADD COLUMN     "job_id" TEXT NOT NULL;
