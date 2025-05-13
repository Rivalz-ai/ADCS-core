/*
  Warnings:

  - Added the required column `name` to the `user_api_key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_api_key" ADD COLUMN     "name" TEXT NOT NULL;
