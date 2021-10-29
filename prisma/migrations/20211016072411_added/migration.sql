/*
  Warnings:

  - Made the column `cards` on table `Deck` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Deck" ALTER COLUMN "cards" SET NOT NULL;
