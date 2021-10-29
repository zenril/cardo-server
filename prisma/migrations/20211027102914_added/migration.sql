/*
  Warnings:

  - You are about to drop the column `lastPlayer` on the `Stats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lastUserId]` on the table `Stats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "lastPlayer",
ADD COLUMN     "lastUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Stats.lastUserId_unique" ON "Stats"("lastUserId");

-- AddForeignKey
ALTER TABLE "Stats" ADD FOREIGN KEY ("lastUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
