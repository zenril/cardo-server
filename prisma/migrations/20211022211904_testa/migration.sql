-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "uuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "uuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" DROP NOT NULL;
