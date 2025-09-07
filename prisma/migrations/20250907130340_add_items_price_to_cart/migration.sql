/*
  Warnings:

  - Added the required column `itemsPrice` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "itemsPrice" DECIMAL(12,2) NOT NULL;
