-- AlterTable
ALTER TABLE "genres" ADD COLUMN     "lastSyncAt" TIMESTAMP(3),
ALTER COLUMN "externalId" DROP NOT NULL;
