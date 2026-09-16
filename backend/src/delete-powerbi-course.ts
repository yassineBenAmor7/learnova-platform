import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deletePowerBICourse() {
  console.log('Deleting Power BI course and all related data...');
  
  try {
    // Find the course
    const course = await prisma.course.findFirst({
      where: { title: "Data Analytics & Power BI" },
    });

    if (!course) {
      console.log('Course "Data Analytics & Power BI" not found. Nothing to delete.');
      return;
    }

    console.log(`Found course with ID: ${course.id}`);

    // Get quizzes
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: course.id },
    });
    const quizIds = quizzes.map(q => q.id);

    // 1. Delete QuizAnswer
    await prisma.quizAnswer.deleteMany({
      where: { attempt: { quizId: { in: quizIds } } },
    });
    console.log('Deleted all quiz answers');

    // 2. Delete QuizAttempt
    await prisma.quizAttempt.deleteMany({
      where: { quizId: { in: quizIds } },
    });
    console.log('Deleted all quiz attempts');

    // 3. Delete Question
    await prisma.question.deleteMany({
      where: { quizId: { in: quizIds } },
    });
    console.log('Deleted all questions');

    // 4. Delete Quiz
    await prisma.quiz.deleteMany({
      where: { courseId: course.id },
    });
    console.log('Deleted all quizzes');

    // Get sessions
    const sessions = await prisma.session.findMany({
      where: { courseId: course.id },
    });
    const sessionIds = sessions.map(s => s.id);

    // Get videos
    const videos = await prisma.video.findMany({
      where: { sessionId: { in: sessionIds } },
    });
    const videoIds = videos.map(v => v.id);

    // 5. Delete VideoWatch
    await prisma.videoWatch.deleteMany({
      where: { videoId: { in: videoIds } },
    });
    console.log('Deleted all video watches');

    // 6. Delete Video
    await prisma.video.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    console.log('Deleted all videos');

    // 7. Delete SessionCompletion
    await prisma.sessionCompletion.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    console.log('Deleted all session completions');

    // 8. Delete Session
    await prisma.session.deleteMany({
      where: { courseId: course.id },
    });
    console.log('Deleted all sessions');

    // 9. Delete Certificate
    await prisma.certificate.deleteMany({
      where: { courseId: course.id },
    });
    console.log('Deleted all certificates');

    // 10. Delete Progress
    await prisma.progress.deleteMany({
      where: { enrollment: { courseId: course.id } },
    });
    console.log('Deleted all progress records');

    // 11. Delete Enrollment
    await prisma.enrollment.deleteMany({
      where: { courseId: course.id },
    });
    console.log('Deleted all enrollments');

    // 12. Delete Course
    await prisma.course.delete({
      where: { id: course.id },
    });
    console.log('Deleted the course');

    console.log('✅ Power BI course and all related data deleted successfully!');

  } catch (error) {
    console.error('❌ Error during deletion:', error);
    throw error;
  }
}

deletePowerBICourse()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
