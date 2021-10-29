-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER,
    "lastPlayer" TEXT NOT NULL,
    "playedCards" INTEGER NOT NULL,
    "totalCards" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stats.gameId_unique" ON "Stats"("gameId");

-- CreateIndex
CREATE INDEX "Stats.gameId_updatedAt" ON "Stats"("updatedAt", "gameId");

-- AddForeignKey
ALTER TABLE "Stats" ADD FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
