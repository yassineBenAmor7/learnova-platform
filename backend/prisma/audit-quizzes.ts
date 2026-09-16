import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      sessions: { orderBy: { orderNumber: 'asc' } },
      quizzes: {
        include: { questions: { include: { options: true } } },
      },
    },
  });

  console.log(`Auditing ${courses.length} courses...\n`);

  let missingPractice = 0;
  let wrongPracticeCount = 0;
  let missingExam = 0;
  let wrongExamCount = 0;

  for (const course of courses) {
    const practiceQuizzes = course.quizzes.filter((q) => !q.isExamMode);
    const examQuizzes = course.quizzes.filter((q) => q.isExamMode);

    console.log(`\n${course.title} (${course.sessions.length} sessions)`);
    console.log(`  Practice quizzes: ${practiceQuizzes.length}, Exams: ${examQuizzes.length}`);

    for (const session of course.sessions) {
      const linked = practiceQuizzes.find((q) => q.sessionId === session.id);
      const quiz = linked;
      if (!quiz) {
        missingPractice++;
        console.log(`  ✗ Session "${session.title}" — no practice quiz`);
      } else if (quiz.questions.length !== 3) {
        wrongPracticeCount++;
        console.log(`  ! Session "${session.title}" — quiz has ${quiz.questions.length} questions (need 3)`);
      }
    }

    if (course.sessions.length > 0 && practiceQuizzes.length < course.sessions.length) {
      missingPractice += course.sessions.length - practiceQuizzes.length;
    }

    if (!examQuizzes.length) {
      missingExam++;
      console.log(`  ✗ No final exam`);
    } else {
      const exam = examQuizzes[0];
      if (exam.questions.length !== 40) {
        wrongExamCount++;
        console.log(`  ! Final exam has ${exam.questions.length} questions (need 40)`);
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Sessions missing practice quiz: ~${missingPractice}`);
  console.log(`Practice quizzes wrong question count: ${wrongPracticeCount}`);
  console.log(`Courses missing final exam: ${missingExam}`);
  console.log(`Exams wrong question count: ${wrongExamCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
