const { prisma, closePrismaClient } = require('./prisma-client');

async function audit() {
  console.log('=== AUDIT EXHAUSTIF DES QUIZZ (PRATIQUE & EXAMENS FINAUX) ===\n');

  // 1. FINAL EXAMS
  const finalExams = await prisma.quiz.findMany({
    where: { isExamMode: true, sessionId: null },
    include: {
      course: { select: { id: true, title: true, domain: true } },
      questions: {
        include: { options: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log('1. EXAMENS FINAUX DE CERTIFICATION:');
  console.log('  Total examens finaux:', finalExams.length);
  
  let non40Exams = 0;
  let finalQuestionsCount = 0;
  const examQuestionTexts = new Set();
  let duplicateExamQuestions = 0;
  let examQuestionsWith4Options = 0;
  let examQuestionsWith1Correct = 0;
  let examOptionsTotal = 0;
  let examOptionsWithExplanation = 0;

  finalExams.forEach(e => {
    if (e.questions.length !== 40) {
      non40Exams++;
      console.log('  [ANOMALIE] Examen ' + e.id + ' (' + e.course.title + ') a ' + e.questions.length + ' questions au lieu de 40');
    }
    finalQuestionsCount += e.questions.length;

    e.questions.forEach(q => {
      const trimmed = q.text.trim().toLowerCase();
      if (examQuestionTexts.has(trimmed)) {
        duplicateExamQuestions++;
      } else {
        examQuestionTexts.add(trimmed);
      }

      if (q.options.length === 4) examQuestionsWith4Options++;
      const correctCount = q.options.filter(o => o.isCorrect).length;
      if (correctCount === 1) examQuestionsWith1Correct++;

      examOptionsTotal += q.options.length;
      q.options.forEach(o => {
        if (o.explanation && o.explanation.trim() !== '') examOptionsWithExplanation++;
      });
    });
  });

  console.log('  Examens avec exactement 40 questions:', (finalExams.length - non40Exams) + ' / ' + finalExams.length);
  console.log('  Total questions d\'examens:', finalQuestionsCount);
  console.log('  Questions uniques dans les examens:', examQuestionTexts.size);
  console.log('  Questions redondantes/dupliquées entre examens:', duplicateExamQuestions);
  console.log('  Questions d\'examens avec exactement 4 options:', examQuestionsWith4Options + ' / ' + finalQuestionsCount);
  console.log('  Questions d\'examens avec exactement 1 bonne réponse:', examQuestionsWith1Correct + ' / ' + finalQuestionsCount);
  console.log('  Options d\'examen avec explications:', examOptionsWithExplanation + ' / ' + examOptionsTotal);

  // Check Coursera parameters for final exams
  let wrongParamsCount = 0;
  finalExams.forEach(e => {
    if (
      e.passingScore !== 80 ||
      e.timeLimitMinutes !== 60 ||
      e.maxAttempts !== 3 ||
      !e.randomizeQuestions ||
      !e.randomizeAnswers ||
      e.showExplanationAfterAnswer !== false ||
      !e.allowReviewAfterSubmission
    ) {
      wrongParamsCount++;
    }
  });
  console.log('  Examens avec tous les paramètres Coursera conformes (80%, 60min, 3 tentatives, etc.):', (finalExams.length - wrongParamsCount) + ' / ' + finalExams.length);

  // Sample 3 questions from final exams
  console.log('\n  Échantillon de questions d\'examens finaux:');
  finalExams[0].questions.slice(0, 3).forEach((q, i) => {
    console.log(`    Q${i+1} [${q.points || 1} pt]: "${q.text}"`);
    q.options.forEach(o => console.log(`       [${o.isCorrect ? 'X' : ' '}] ${o.text}`));
  });

  // 2. PRACTICE QUIZZES
  const practiceQuizzes = await prisma.quiz.findMany({
    where: {
      OR: [
        { isExamMode: false },
        { sessionId: { not: null } }
      ]
    },
    include: {
      session: {
        include: { course: { select: { id: true, title: true, domain: true } } }
      },
      questions: {
        include: { options: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log('\n2. PRACTICE QUIZZES (QUIZZ DE SESSION):');
  console.log('  Total practice quizzes:', practiceQuizzes.length);

  let practiceQuestionsCount = 0;
  let quizzesOutOf3to5 = 0;
  const practiceQuestionTexts = new Set();
  let duplicatePracticeQuestions = 0;
  let practiceQuestionsWith4Options = 0;
  let practiceQuestionsWith1Correct = 0;
  let practiceOptionsTotal = 0;
  let practiceOptionsWithExplanation = 0;
  const questionCountDist = {};

  practiceQuizzes.forEach(q => {
    const count = q.questions.length;
    questionCountDist[count] = (questionCountDist[count] || 0) + 1;
    if (count < 3 || count > 5) {
      quizzesOutOf3to5++;
      console.log('  [ANOMALIE] Practice quiz ' + q.id + ' a ' + count + ' questions (attendu: 3, 4 ou 5)');
    }
    practiceQuestionsCount += count;

    q.questions.forEach(quest => {
      const trimmed = quest.text.trim().toLowerCase();
      if (practiceQuestionTexts.has(trimmed)) {
        duplicatePracticeQuestions++;
      } else {
        practiceQuestionTexts.add(trimmed);
      }

      if (quest.options.length === 4) practiceQuestionsWith4Options++;
      const correctCount = quest.options.filter(o => o.isCorrect).length;
      if (correctCount === 1) practiceQuestionsWith1Correct++;

      practiceOptionsTotal += quest.options.length;
      quest.options.forEach(o => {
        if (o.explanation && o.explanation.trim() !== '') practiceOptionsWithExplanation++;
      });
    });
  });

  console.log('  Distribution du nombre de questions par practice quiz:', questionCountDist);
  console.log('  Practice quizzes respectant strictement 3 à 5 questions:', (practiceQuizzes.length - quizzesOutOf3to5) + ' / ' + practiceQuizzes.length);
  console.log('  Total questions de practice quizzes:', practiceQuestionsCount);
  console.log('  Questions uniques dans les practice quizzes:', practiceQuestionTexts.size);
  console.log('  Questions redondantes:', duplicatePracticeQuestions);
  console.log('  Questions de practice quiz avec 4 options:', practiceQuestionsWith4Options + ' / ' + practiceQuestionsCount);
  console.log('  Questions de practice quiz avec 1 bonne réponse:', practiceQuestionsWith1Correct + ' / ' + practiceQuestionsCount);
  console.log('  Options de practice quiz avec explications:', practiceOptionsWithExplanation + ' / ' + practiceOptionsTotal);

  // Sample 2 practice quiz questions
  console.log('\n  Échantillon de questions de practice quiz:');
  practiceQuizzes[0].questions.slice(0, 3).forEach((q, i) => {
    console.log(`    PQ${i+1} [${q.points || 1} pt]: "${q.text}"`);
    q.options.forEach(o => console.log(`       [${o.isCorrect ? 'X' : ' '}] ${o.text}`));
  });

  // Cross-check: Are any questions shared between practice quizzes and final exams?
  let sharedQuestions = 0;
  for (const text of practiceQuestionTexts) {
    if (examQuestionTexts.has(text)) {
      sharedQuestions++;
    }
  }
  console.log('\n3. ISOLATION PRATIQUE vs EXAMEN FINAL:');
  console.log('  Questions partagées/dupliquées entre Practice Quizzes et Examens Finaux:', sharedQuestions);
}

audit().catch(console.error).finally(() => closePrismaClient());
