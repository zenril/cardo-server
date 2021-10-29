/*
  Warnings:

  - You are about to drop the column `playerId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `deck` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_playerId_fkey";

-- DropIndex
DROP INDEX "Card.type_name_gameid_playerid_uuid_index";

-- DropIndex
DROP INDEX "Game.uuid_name_index";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "playerId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "deck",
ADD COLUMN     "deckId" INTEGER;

-- CreateIndex
CREATE INDEX "Card.type_name_gameid_userid_uuid_index" ON "Card"("type", "name", "gameId", "userId", "uuid");

-- CreateIndex
CREATE INDEX "Game.uuid_name_index_deckId" ON "Game"("uuid", "name", "deckId");

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Deck.uuid_name_playerid_index" RENAME TO "Deck.uuid_name_userid_index";
