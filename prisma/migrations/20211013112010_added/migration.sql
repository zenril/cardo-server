/*
  Warnings:

  - The `cards` column on the `Deck` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "cards",
ADD COLUMN     "cards" JSONB;
