/*
  Warnings:

  - Added the required column `userAgent` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "userAgent" TEXT NOT NULL;
