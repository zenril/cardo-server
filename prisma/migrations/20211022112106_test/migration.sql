/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deck" ALTER COLUMN "uuid" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deck.uuid_unique" ON "Deck"("uuid");
