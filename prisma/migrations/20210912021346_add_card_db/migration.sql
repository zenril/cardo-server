/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `expire` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
ADD COLUMN     "expire" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "sess" JSON NOT NULL,
ALTER COLUMN "sid" DROP DEFAULT,
ALTER COLUMN "sid" SET DATA TYPE VARCHAR,
ADD PRIMARY KEY ("sid");
DROP SEQUENCE "Session_sid_seq";

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "type" TEXT NOT NULL DEFAULT E'',
    "set" TEXT NOT NULL DEFAULT E'',
    "gameId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Card.type_name_index" ON "Card"("type", "name");

-- CreateIndex
CREATE INDEX "Session.IDX_session_expire" ON "Session"("expire");

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
