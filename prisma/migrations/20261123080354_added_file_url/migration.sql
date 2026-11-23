-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "body" DROP NOT NULL;
