import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizzes() {
  console.log('🔍 Checking all quizzes for Agile course...');

  try {
    // Find the Agile course
    const course = await prisma.course.findFirst({
      where: { title: { contains: 'Agile' } }
    });

    if (!course) {
      console.error('❌ Agile course not found.');
      return;
    }

    console.log(`✅ Found course: ${course.title} (ID: ${course.id})`);

    // Find all quizzes for this course
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: course.id },
      orderBy: { id: 'asc' }
    });

    console.log(`\n✅ Found ${quizzes.length} quizzes for this course:\n`);
    
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. Quiz ID: ${quiz.id}`);
      console.log(`   Title: ${quiz.title}`);
      console.log(`   isExamMode: ${quiz.isExamMode}`);
      console.log(`   Passing Score: ${quiz.passingScore}`);
      console.log(`   Time Limit: ${quiz.timeLimitMinutes} minutes`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking quizzes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizzes();
