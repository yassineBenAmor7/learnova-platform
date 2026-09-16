import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixQuizAttempt() {
  console.log('🔄 Fixing QuizAttempt for Agile exam...');

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

    // Find the final exam quiz for this course
    const quiz = await prisma.quiz.findFirst({
      where: { 
        courseId: course.id,
        isExamMode: true
      }
    });

    if (!quiz) {
      console.error('❌ Final exam quiz not found for this course.');
      return;
    }

    console.log(`✅ Found quiz: ${quiz.title}`);

    // Find the quiz attempt for this user and quiz
    const attempt = await prisma.quizAttempt.findFirst({
      where: { 
        userId: user.id,
        quizId: quiz.id
      }
    });

    if (!attempt) {
      console.error('❌ Quiz attempt not found for this user and quiz.');
      console.log('Available quiz attempts:');
      const allAttempts = await prisma.quizAttempt.findMany({ 
        where: { userId: user.id },
        include: { quiz: true }
      });
      console.log(allAttempts);
      return;
    }

    console.log(`✅ Found quiz attempt: ID ${attempt.id}, passed: ${attempt.passed}, score: ${attempt.score}`);

    // Update the attempt to mark it as passed
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { 
        passed: true,
        score: attempt.score || 80 // Set a reasonable score if not set
      }
    });

    console.log('✅ Quiz attempt updated successfully!');
    console.log(`Passed: ${updatedAttempt.passed}`);
    console.log(`Score: ${updatedAttempt.score}`);

    console.log('🎉 Quiz attempt fix completed!');
  } catch (error) {
    console.error('❌ Error fixing quiz attempt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixQuizAttempt();
