-- DropIndex
DROP INDEX "Card.type_name_gameid_playerid_index";

-- CreateIndex
CREATE INDEX "Card.type_name_gameid_playerid_uuid_index" ON "Card"("type", "name", "gameId", "playerId", "uuid");
