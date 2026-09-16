import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditQuizQuality() {
  console.log('🔍 Auditing Quiz Quality...\n');

  // Get all courses
  const courses = await prisma.course.findMany({
    include: {
      quizzes: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
      sessions: {
        include: {
          quizzes: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let totalFinalExams = 0;
  let totalFinalExamQuestions = 0;
  let totalPracticeQuizzes = 0;
  let totalPracticeQuizQuestions = 0;
  let totalQuestions = 0;
  let totalOptions = 0;
  let questionsWithout4Options = 0;
  let questionsWithoutCorrectAnswer = 0;
  let questionsWithoutExplanations = 0;
  let finalExamsWithWrongParams = 0;
  let practiceQuizzesWithWrongParams = 0;

  for (const course of courses) {
    // Check final exams (course-level, isExamMode: true)
    const finalExams = course.quizzes.filter(q => q.isExamMode && q.sessionId === null);
    totalFinalExams += finalExams.length;

    for (const exam of finalExams) {
      totalFinalExamQuestions += exam.questions.length;
      totalQuestions += exam.questions.length;

      // Check Coursera parameters
      if (
        exam.passingScore !== 70 ||
        exam.timeLimitMinutes === null ||
        exam.timeLimitMinutes < 60 ||
        exam.timeLimitMinutes > 75 ||
        exam.maxAttempts !== 3 ||
        !exam.randomizeQuestions ||
        !exam.randomizeAnswers ||
        exam.showExplanationAfterAnswer !== false ||
        exam.allowReviewAfterSubmission !== true
      ) {
        finalExamsWithWrongParams++;
        console.log(`❌ Final Exam ${exam.id} (Course: ${course.title}) has wrong parameters:`);
        console.log(`   passingScore: ${exam.passingScore} (expected: 70)`);
        console.log(`   timeLimitMinutes: ${exam.timeLimitMinutes} (expected: 60-75)`);
        console.log(`   maxAttempts: ${exam.maxAttempts} (expected: 3)`);
        console.log(`   randomizeQuestions: ${exam.randomizeQuestions} (expected: true)`);
        console.log(`   randomizeAnswers: ${exam.randomizeAnswers} (expected: true)`);
        console.log(`   showExplanationAfterAnswer: ${exam.showExplanationAfterAnswer} (expected: false)`);
        console.log(`   allowReviewAfterSubmission: ${exam.allowReviewAfterSubmission} (expected: true)`);
      }

      // Check question count
      if (exam.questions.length !== 40) {
        console.log(`❌ Final Exam ${exam.id} (Course: ${course.title}) has ${exam.questions.length} questions (expected: 40)`);
      }

      for (const question of exam.questions) {
        totalOptions += question.options.length;

        // Check 4 options
        if (question.options.length !== 4) {
          questionsWithout4Options++;
          console.log(`❌ Question ${question.id} in Final Exam ${exam.id} has ${question.options.length} options (expected: 4)`);
        }

        // Check exactly 1 correct answer
        const correctCount = question.options.filter(o => o.isCorrect).length;
        if (correctCount !== 1) {
          questionsWithoutCorrectAnswer++;
          console.log(`❌ Question ${question.id} in Final Exam ${exam.id} has ${correctCount} correct answers (expected: 1)`);
        }

        // Check explanations (if explanation field exists)
        if (question.options.some(o => !o.explanation || o.explanation.trim() === '')) {
          questionsWithoutExplanations++;
        }
      }
    }

    // Check practice quizzes (session-level, isExamMode: false)
    for (const session of course.sessions) {
      const practiceQuizzes = session.quizzes.filter(q => !q.isExamMode);
      totalPracticeQuizzes += practiceQuizzes.length;

      for (const quiz of practiceQuizzes) {
        totalPracticeQuizQuestions += quiz.questions.length;
        totalQuestions += quiz.questions.length;

        // Check practice quiz parameters
        if (quiz.maxAttempts !== null || quiz.passingScore !== 70) {
          practiceQuizzesWithWrongParams++;
          console.log(`⚠️ Practice Quiz ${quiz.id} (Session: ${session.title}) has non-standard parameters:`);
          console.log(`   maxAttempts: ${quiz.maxAttempts} (expected: null for unlimited)`);
          console.log(`   passingScore: ${quiz.passingScore} (expected: 70)`);
        }

        // Check question count (3-5 questions for practice)
        if (quiz.questions.length < 3 || quiz.questions.length > 5) {
          console.log(`⚠️ Practice Quiz ${quiz.id} (Session: ${session.title}) has ${quiz.questions.length} questions (expected: 3-5)`);
        }

        for (const question of quiz.questions) {
          totalOptions += question.options.length;

          // Check 4 options
          if (question.options.length !== 4) {
            questionsWithout4Options++;
            console.log(`❌ Question ${question.id} in Practice Quiz ${quiz.id} has ${question.options.length} options (expected: 4)`);
          }

          // Check exactly 1 correct answer
          const correctCount = question.options.filter(o => o.isCorrect).length;
          if (correctCount !== 1) {
            questionsWithoutCorrectAnswer++;
            console.log(`❌ Question ${question.id} in Practice Quiz ${quiz.id} has ${correctCount} correct answers (expected: 1)`);
          }
        }
      }
    }
  }

  // Get user attempts and certificates to verify they're unaffected
  const userAttempts = await prisma.quizAttempt.count();
  const certificates = await prisma.certificate.count();

  console.log('\n📊 AUDIT RESULTS:');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`Courses processed: ${courses.length}`);
  console.log(`\nFinal Certification Exams:`);
  console.log(`  Total final exams: ${totalFinalExams} (expected: 108)`);
  console.log(`  Total final exam questions: ${totalFinalExamQuestions} (expected: 4,320)`);
  console.log(`  Final exams with wrong Coursera parameters: ${finalExamsWithWrongParams} (expected: 0)`);
  console.log(`\nPractice Quizzes:`);
  console.log(`  Total practice quizzes: ${totalPracticeQuizzes} (expected: ~142)`);
  console.log(`  Total practice quiz questions: ${totalPracticeQuizQuestions} (expected: ~426-710)`);
  console.log(`  Practice quizzes with wrong parameters: ${practiceQuizzesWithWrongParams} (expected: 0)`);
  console.log(`\nQuestion Quality:`);
  console.log(`  Total questions: ${totalQuestions}`);
  console.log(`  Total options: ${totalOptions}`);
  console.log(`  Questions without 4 options: ${questionsWithout4Options} (expected: 0)`);
  console.log(`  Questions without exactly 1 correct answer: ${questionsWithoutCorrectAnswer} (expected: 0)`);
  console.log(`  Questions without explanations: ${questionsWithoutExplanations}`);
  console.log(`\nUser Data Integrity:`);
  console.log(`  User attempts: ${userAttempts} (should remain unchanged)`);
  console.log(`  Certificates: ${certificates} (should remain unchanged)`);
  console.log('═══════════════════════════════════════════════════════════════════════════════');

  if (
    totalFinalExams === 108 &&
    totalFinalExamQuestions === 4320 &&
    finalExamsWithWrongParams === 0 &&
    questionsWithout4Options === 0 &&
    questionsWithoutCorrectAnswer === 0
  ) {
    console.log('\n✅ AUDIT PASSED: All checks successful!');
  } else {
    console.log('\n❌ AUDIT FAILED: Some checks did not pass. See details above.');
  }
}

auditQuizQuality()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
