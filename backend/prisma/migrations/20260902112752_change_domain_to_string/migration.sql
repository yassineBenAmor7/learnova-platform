/*
  Warnings:

  - The `domain` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CourseDomain" ADD VALUE 'HEALTH_WELLNESS';
ALTER TYPE "CourseDomain" ADD VALUE 'PERSONAL_DEVELOPMENT';
ALTER TYPE "CourseDomain" ADD VALUE 'ACADEMIC_SCIENCES';
ALTER TYPE "CourseDomain" ADD VALUE 'MUSIC_ARTS';
ALTER TYPE "CourseDomain" ADD VALUE 'SOFTWARE_ENGINEERING';
ALTER TYPE "CourseDomain" ADD VALUE 'SALES_E_COMMERCE';
ALTER TYPE "CourseDomain" ADD VALUE 'HUMANITIES_SOCIAL';
ALTER TYPE "CourseDomain" ADD VALUE 'LAW_LEGAL';
ALTER TYPE "CourseDomain" ADD VALUE 'LIFESTYLE_HOBBIES';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "recommended" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "domain",
ADD COLUMN     "domain" TEXT NOT NULL DEFAULT 'IT_DATA';

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "sessionId" INTEGER,
ALTER COLUMN "maxAttempts" DROP NOT NULL,
ALTER COLUMN "maxAttempts" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SessionReadCompletion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionReadCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionReadCompletion_userId_sessionId_key" ON "SessionReadCompletion"("userId", "sessionId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReadCompletion" ADD CONSTRAINT "SessionReadCompletion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReadCompletion" ADD CONSTRAINT "SessionReadCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
