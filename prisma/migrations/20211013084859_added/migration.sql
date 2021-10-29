/*
  Warnings:

  - You are about to drop the column `deckId` on the `Card` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_deckId_fkey";

-- DropIndex
DROP INDEX "Card.type_name_gameid_playerid_uuid_index";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "deckId";

-- CreateTable
CREATE TABLE "DeckCard" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "type" TEXT NOT NULL DEFAULT E'',
    "deckId" INTEGER,
    "played" TIMESTAMP(3),
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeckCard.uuid_unique" ON "DeckCard"("uuid");

-- CreateIndex
CREATE INDEX "DeckCard.type_name_gameId_playerId_uuid_deckId" ON "DeckCard"("type", "name", "uuid", "deckId");

-- CreateIndex
CREATE INDEX "Card.type_name_gameid_playerid_uuid_index" ON "Card"("type", "name", "gameId", "playerId", "uuid");

-- AddForeignKey
ALTER TABLE "DeckCard" ADD FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
