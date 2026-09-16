import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

async function updateExamCourseraParams() {
  console.log('🚀 Updating Final Certification Exams to Coursera standard (passingScore = 80)...');

  const updateResult = await prisma.quiz.updateMany({
    where: {
      isExamMode: true,
      sessionId: null,
    },
    data: {
      passingScore: 80,
      timeLimitMinutes: 60,
      maxAttempts: 3,
      randomizeQuestions: true,
      randomizeAnswers: true,
      showExplanationAfterAnswer: false,
      allowReviewAfterSubmission: true,
    },
  });

  console.log(`✅ Successfully updated ${updateResult.count} final certification exams to Coursera standards!`);
}

updateExamCourseraParams()
  .catch((err) => {
    console.error('❌ Error updating exam params:', err);
    process.exit(1);
  })
  .finally(() => closePrismaClient());
