-- AlterTable
ALTER TABLE "Session" ADD COLUMN "content" TEXT;

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN "learningTimeSeconds" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 70;
ALTER TABLE "Quiz" ADD COLUMN "timeLimitMinutes" INTEGER;
ALTER TABLE "Quiz" ADD COLUMN "isExamMode" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN "isExamMode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "QuizAttempt" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "QuizAttempt" ALTER COLUMN "score" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "SessionCompletion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoWatch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,
    "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastWatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoWatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGamification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "totalLearningTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserGamification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionCompletion_userId_sessionId_key" ON "SessionCompletion"("userId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoWatch_userId_videoId_key" ON "VideoWatch"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGamification_userId_key" ON "UserGamification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "SessionCompletion" ADD CONSTRAINT "SessionCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionCompletion" ADD CONSTRAINT "SessionCompletion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWatch" ADD CONSTRAINT "VideoWatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoWatch" ADD CONSTRAINT "VideoWatch_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGamification" ADD CONSTRAINT "UserGamification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
