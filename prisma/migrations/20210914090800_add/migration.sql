-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();
