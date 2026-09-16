/*
  Warnings:

  - You are about to drop the column `content` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `UserGamification` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `UserGamification` table. All the data in the column will be lost.
  - You are about to drop the column `totalLearningTime` on the `UserGamification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAnswer" DROP CONSTRAINT "QuizAnswer_questionId_fkey";

-- DropIndex
DROP INDEX "Certificate_userId_courseId_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "UserGamification" DROP COLUMN "level",
DROP COLUMN "points",
DROP COLUMN "totalLearningTime";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
