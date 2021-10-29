/*
  Warnings:

  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "open" BOOLEAN NOT NULL,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE INDEX "Game.uuid_name_index" ON "Game"("uuid", "name");
