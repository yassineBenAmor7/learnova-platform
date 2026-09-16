import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllQuizAttempts() {
  console.log('🔄 Fixing all QuizAttempts for Agile course...');

  try {
    // Find the user Yassine Ben Amor
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'benamoryassine519@gmail.com' },
          { firstName: 'Yassine', lastName: 'Ben Amor' }
        ]
      }
    });

    if (!user) {
      console.error('❌ User Yassine Ben Amor not found.');
      return;
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);

    // Find the Agile course
    const course = await prisma.course.findFirst({
      where: { title: { contains: 'Agile' } }
    });

    if (!course) {
      console.error('❌ Agile course not found.');
      return;
    }

    console.log(`✅ Found course: ${course.title}`);

    // Find all quizzes for this course
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: course.id }
    });

    console.log(`✅ Found ${quizzes.length} quizzes for this course`);

    // Find all quiz attempts for this user and course
    const attempts = await prisma.quizAttempt.findMany({
      where: { 
        userId: user.id,
        quiz: { courseId: course.id }
      },
      include: { quiz: true }
    });

    console.log(`✅ Found ${attempts.length} quiz attempts for this user and course`);

    let updatedCount = 0;
    for (const attempt of attempts) {
      console.log(`\n--- Quiz Attempt ${attempt.id} ---`);
      console.log(`Quiz: ${attempt.quiz.title}`);
      console.log(`Current passed: ${attempt.passed}`);
      console.log(`Current score: ${attempt.score}`);

      // Update the attempt to mark it as passed
      const updatedAttempt = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { 
          passed: true,
          score: attempt.score || 85 // Set a reasonable score if not set
        }
      });

      console.log(`✅ Updated - passed: ${updatedAttempt.passed}, score: ${updatedAttempt.score}`);
      updatedCount++;
    }

    console.log(`\n🎉 All quiz attempts fixed! Updated ${updatedCount} attempts.`);
  } catch (error) {
    console.error('❌ Error fixing quiz attempts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllQuizAttempts();
