const { prisma, closePrismaClient } = require('./prisma-client');

async function setPassingScore70() {
  console.log('🚀 Updating all 108 Final Certification Exams to passingScore = 70%...');

  const result = await prisma.quiz.updateMany({
    where: {
      isExamMode: true,
      sessionId: null,
    },
    data: {
      passingScore: 70,
    },
  });

  console.log(`✅ Updated ${result.count} final certification exams to passingScore = 70%`);

  // Verify all quizzes across platform
  const finalExams = await prisma.quiz.findMany({
    where: { isExamMode: true, sessionId: null },
    select: { id: true, passingScore: true }
  });
  const practiceQuizzes = await prisma.quiz.findMany({
    where: { OR: [{ isExamMode: false }, { sessionId: { not: null } }] },
    select: { id: true, passingScore: true }
  });

  const finalPassCounts = {};
  finalExams.forEach(e => finalPassCounts[e.passingScore] = (finalPassCounts[e.passingScore] || 0) + 1);

  const practicePassCounts = {};
  practiceQuizzes.forEach(q => practicePassCounts[q.passingScore] = (practicePassCounts[q.passingScore] || 0) + 1);

  console.log('\n📊 VERIFICATION DES SEUILS :');
  console.log('  Examens Finaux (108 cours) :', finalPassCounts);
  console.log('  Practice Quizzes (142 sessions) :', practicePassCounts);
}

setPassingScore70()
  .catch(console.error)
  .finally(() => closePrismaClient());
