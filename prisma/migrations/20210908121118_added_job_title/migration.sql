-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE INDEX "User.uuid_index" ON "User"("uuid");
