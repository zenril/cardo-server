/*
  Warnings:

  - You are about to drop the column `playerId` on the `Deck` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_playerId_fkey";

-- DropIndex
DROP INDEX "Deck.uuid_name_playerid_index";

-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "playerId",
ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE INDEX "Deck.uuid_name_playerid_index" ON "Deck"("uuid", "name", "userId");

-- AddForeignKey
ALTER TABLE "Deck" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
