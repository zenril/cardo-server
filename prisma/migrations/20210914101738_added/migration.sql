/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card.uuid_unique" ON "Card"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Game.uuid_unique" ON "Game"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User.uuid_unique" ON "User"("uuid");
