/*
  Warnings:

  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
