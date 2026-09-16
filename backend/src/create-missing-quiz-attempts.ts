import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMissingQuizAttempts() {
  console.log('🔄 Creating missing QuizAttempts for practice quizzes...');

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

    // Find practice quizzes (isExamMode: false)
    const practiceQuizzes = await prisma.quiz.findMany({
      where: { 
        courseId: course.id,
        isExamMode: false
      }
    });

    console.log(`✅ Found ${practiceQuizzes.length} practice quizzes`);

    // Create attempts for each practice quiz
    let createdCount = 0;
    for (const quiz of practiceQuizzes) {
      // Check if attempt already exists
      const existingAttempt = await prisma.quizAttempt.findFirst({
        where: { 
          userId: user.id,
          quizId: quiz.id
        }
      });

      if (existingAttempt) {
        console.log(`⚠️ Attempt already exists for quiz: ${quiz.title}`);
        continue;
      }

      // Create new attempt
      const attempt = await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          startedAt: new Date(),
          finishedAt: new Date(),
          passed: true,
          score: 85,
          answers: {}
        }
      });

      console.log(`✅ Created attempt for quiz: ${quiz.title} (ID: ${attempt.id})`);
      createdCount++;
    }

    console.log(`\n🎉 Created ${createdCount} missing quiz attempts!`);
  } catch (error) {
    console.error('❌ Error creating quiz attempts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingQuizAttempts();
