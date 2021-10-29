-- DropIndex
DROP INDEX "Card.type_name_index";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "description" TEXT,
ADD COLUMN     "played" TIMESTAMP(3),
ADD COLUMN     "playerId" INTEGER;

-- CreateIndex
CREATE INDEX "Card.type_name_gameid_index" ON "Card"("type", "name", "gameId");

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
