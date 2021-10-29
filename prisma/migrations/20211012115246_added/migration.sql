-- DropIndex
DROP INDEX "Card.type_name_gameid_playerid_uuid_index";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "deckId" INTEGER;

-- CreateTable
CREATE TABLE "Deck" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "playerId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deck.uuid_unique" ON "Deck"("uuid");

-- CreateIndex
CREATE INDEX "Deck.uuid_name_playerid_index" ON "Deck"("uuid", "name", "playerId");

-- CreateIndex
CREATE INDEX "Card.type_name_gameid_playerid_uuid_index" ON "Card"("type", "name", "gameId", "playerId", "uuid", "deckId");

-- AddForeignKey
ALTER TABLE "Deck" ADD FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
