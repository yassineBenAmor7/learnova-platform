import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type QOption = { text: string; isCorrect: boolean };
type Question = { text: string; options: QOption[] };

const PRACTICE_QUESTIONS_PER_SESSION = 3;
const FINAL_EXAM_QUESTIONS = 40;

function cleanTopic(title: string): string {
  return title
    .replace(/^Session\s+\d+:\s*/i, '')
    .replace(/^Introduction to\s+/i, '')
    .trim();
}

function makeOptions(correct: string, distractors: string[]): QOption[] {
  const opts: QOption[] = [
    { text: correct, isCorrect: true },
    ...distractors.slice(0, 3).map((d) => ({ text: d, isCorrect: false })),
  ];
  // shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function generatePracticeQuestions(sessionTitle: string, courseTitle: string, sessionIndex: number): Question[] {
  const topic = cleanTopic(sessionTitle);
  const templates: Question[] = [
    {
      text: `What is the primary learning objective of "${topic}" in ${courseTitle}?`,
      options: makeOptions(
        `Understand and apply core concepts of ${topic}`,
        [
          `Memorize unrelated formulas without context`,
          `Skip practical applications entirely`,
          `Avoid connecting ${topic} to real-world scenarios`,
        ],
      ),
    },
    {
      text: `Which approach best demonstrates mastery of ${topic}?`,
      options: makeOptions(
        `Applying ${topic} concepts to solve structured problems`,
        [
          `Ignoring foundational principles of ${topic}`,
          `Completing tasks without reviewing session materials`,
          `Focusing only on terminology without understanding`,
        ],
      ),
    },
    {
      text: `Why is ${topic} important within the ${courseTitle} curriculum?`,
      options: makeOptions(
        `It builds essential skills required for advanced topics and professional practice`,
        [
          `It is optional and unrelated to other sessions`,
          `It replaces all other course content`,
          `It has no connection to assessments or certification`,
        ],
      ),
    },
  ];

  // Slight variation by index to reduce duplicate feel across sessions
  templates[0].text = `[Session ${sessionIndex + 1}] ${templates[0].text}`;
  return templates;
}

function generateExamQuestions(courseTitle: string, sessionTitles: string[]): Question[] {
  const pool: Question[] = [];

  sessionTitles.forEach((sessionTitle, idx) => {
    const topic = cleanTopic(sessionTitle);
    pool.push(
      {
        text: `(Exam) Which statement best describes ${topic}?`,
        options: makeOptions(
          `${topic} is a key competency covered in ${courseTitle}`,
          [
            `${topic} is not part of this course`,
            `${topic} requires no prior knowledge`,
            `${topic} is only theoretical with no application`,
          ],
        ),
      },
      {
        text: `(Exam) What should learners prioritize when studying ${topic}?`,
        options: makeOptions(
          `Conceptual understanding and practical application`,
          [`Speed over accuracy`, `Skipping review exercises`, `Ignoring session objectives`],
        ),
      },
      {
        text: `(Exam) How does ${topic} connect to professional outcomes in ${courseTitle}?`,
        options: makeOptions(
          `It develops job-relevant skills and certification readiness`,
          [`It has no professional relevance`, `It only tests memorization`, `It replaces the final exam`],
        ),
      },
    );
  });

  const synthesisTemplates: Question[] = [
    {
      text: `What is the overall goal of completing ${courseTitle}?`,
      options: makeOptions(
        `Gain job-ready skills and pass the certification exam`,
        [`Collect badges without learning`, `Skip all practice assessments`, `Avoid the final exam`],
      ),
    },
    {
      text: `Which study strategy is most effective for ${courseTitle}?`,
      options: makeOptions(
        `Watch lectures, read notes, pass session quizzes, then take the final exam`,
        [`Only take the final exam`, `Skip reading materials`, `Ignore practice quizzes`],
      ),
    },
    {
      text: `What passing score is typically required on practice quizzes in ${courseTitle}?`,
      options: makeOptions(`70% or higher`, [`30%`, `100% only on first try`, `No passing score`]),
    },
    {
      text: `How many attempts are allowed on the final certification exam?`,
      options: makeOptions(`Up to 3 attempts`, [`Unlimited attempts`, `Only 1 attempt ever`, `10 attempts`]),
    },
  ];

  let i = 0;
  while (pool.length < FINAL_EXAM_QUESTIONS) {
    const topic = cleanTopic(sessionTitles[i % sessionTitles.length] || courseTitle);
    pool.push({
      text: `(Exam Q${pool.length + 1}) Advanced review: ${topic} — select the best answer.`,
      options: makeOptions(
        `Demonstrate applied knowledge of ${topic} at a professional level`,
        [
          `Recall only isolated facts without context`,
          `Ignore connections between ${topic} and other modules`,
          `Complete the course without engaging with ${topic}`,
        ],
      ),
    });
    if (pool.length < FINAL_EXAM_QUESTIONS && synthesisTemplates[i % synthesisTemplates.length]) {
      pool.push({ ...synthesisTemplates[i % synthesisTemplates.length], text: `(Exam) ${synthesisTemplates[i % synthesisTemplates.length].text}` });
    }
    i++;
  }

  return pool.slice(0, FINAL_EXAM_QUESTIONS);
}

async function deleteQuizFully(quizId: number) {
  const attempts = await prisma.quizAttempt.findMany({ where: { quizId }, select: { id: true } });
  if (attempts.length) {
    await prisma.quizAnswer.deleteMany({ where: { attemptId: { in: attempts.map((a) => a.id) } } });
    await prisma.quizAttempt.deleteMany({ where: { quizId } });
  }
  const questions = await prisma.question.findMany({ where: { quizId }, select: { id: true } });
  if (questions.length) {
    await prisma.questionOption.deleteMany({ where: { questionId: { in: questions.map((q) => q.id) } } });
    await prisma.question.deleteMany({ where: { quizId } });
  }
  await prisma.quiz.delete({ where: { id: quizId } });
}

async function createQuestions(quizId: number, questions: Question[]) {
  for (const q of questions) {
    const question = await prisma.question.create({ data: { text: q.text, quizId } });
    for (const opt of q.options) {
      await prisma.questionOption.create({
        data: { text: opt.text, isCorrect: opt.isCorrect, questionId: question.id },
      });
    }
  }
}

async function ensureSession(courseId: number, courseTitle: string, description: string) {
  const existing = await prisma.session.findFirst({
    where: { courseId },
    orderBy: { orderNumber: 'asc' },
  });
  if (existing) return existing;

  return prisma.session.create({
    data: {
      courseId,
      title: `Session 1: Introduction to ${courseTitle}`,
      description: description.slice(0, 200),
      orderNumber: 1,
      content: `### Course Introduction\n\n${description}\n\nThis session introduces the foundational concepts you will master throughout ${courseTitle}.`,
    },
  });
}

async function findSessionPracticeQuiz(courseId: number, sessionId: number) {
  return prisma.quiz.findFirst({
    where: { courseId, sessionId, isExamMode: false },
    include: { questions: true },
  });
}

async function ensurePracticeQuiz(
  courseId: number,
  courseTitle: string,
  session: { id: number; title: string; orderNumber: number },
  sessionIndex: number,
) {
  const existing = await findSessionPracticeQuiz(courseId, session.id);

  if (existing?.sessionId === session.id && existing.questions.length === PRACTICE_QUESTIONS_PER_SESSION) {
    await prisma.quiz.update({
      where: { id: existing.id },
      data: { maxAttempts: null, isExamMode: false, passingScore: 70 },
    });
    return existing.id;
  }

  if (existing) await deleteQuizFully(existing.id);

  const topic = cleanTopic(session.title);
  const quiz = await prisma.quiz.create({
    data: {
      title: `Practice Quiz: ${topic}`,
      description: `3-question practice assessment for "${session.title}". Unlimited attempts.`,
      courseId,
      sessionId: session.id,
      isExamMode: false,
      maxAttempts: null,
      passingScore: 70,
      randomizeQuestions: true,
      randomizeAnswers: true,
    },
  });

  await createQuestions(quiz.id, generatePracticeQuestions(session.title, courseTitle, sessionIndex));
  return quiz.id;
}

async function ensureFinalExam(courseId: number, courseTitle: string, sessionTitles: string[]) {
  const exams = await prisma.quiz.findMany({
    where: { courseId, isExamMode: true },
    include: { questions: true },
  });

  const valid = exams.find((e) => e.questions.length === FINAL_EXAM_QUESTIONS);
  if (valid) {
    await prisma.quiz.update({
      where: { id: valid.id },
      data: { 
        maxAttempts: 3, 
        passingScore: 70, 
        timeLimitMinutes: 60,
        randomizeQuestions: true,
        randomizeAnswers: true,
        showExplanationAfterAnswer: false,
        allowReviewAfterSubmission: true
      },
    });
    for (const extra of exams.filter((e) => e.id !== valid.id)) {
      await deleteQuizFully(extra.id);
    }
    return valid.id;
  }

  for (const exam of exams) await deleteQuizFully(exam.id);

  // Remove orphan course-level non-exam quizzes (old single course quiz pattern)
  const orphanCourseQuizzes = await prisma.quiz.findMany({
    where: { courseId, isExamMode: false, sessionId: null },
    include: { questions: true },
  });
  for (const o of orphanCourseQuizzes) await deleteQuizFully(o.id);

  const quiz = await prisma.quiz.create({
    data: {
      title: `Final Certification Exam: ${courseTitle}`,
      description: `Comprehensive 40-question final exam. Maximum 3 attempts. Pass to earn your certificate.`,
      courseId,
      sessionId: null,
      isExamMode: true,
      maxAttempts: 3,
      passingScore: 70,
      timeLimitMinutes: 60,
      randomizeQuestions: true,
      randomizeAnswers: true,
      showExplanationAfterAnswer: false,
      allowReviewAfterSubmission: true,
    },
  });

  await createQuestions(quiz.id, generateExamQuestions(courseTitle, sessionTitles));
  return quiz.id;
}

async function seedAllCourseQuizzes() {
  console.log('🌱 Ensuring practice quizzes (3Q/session) and final exams (40Q) for all courses...\n');

  const courses = await prisma.course.findMany({
    include: {
      sessions: { orderBy: { orderNumber: 'asc' } },
    },
  });

  let practiceCreated = 0;
  let examsCreated = 0;
  let sessionsCreated = 0;

  for (const course of courses) {
    let sessions = course.sessions;
    if (sessions.length === 0) {
      const session = await ensureSession(course.id, course.title, course.description);
      sessions = [session];
      sessionsCreated++;
    }

    for (let i = 0; i < sessions.length; i++) {
      await ensurePracticeQuiz(course.id, course.title, sessions[i], i);
      practiceCreated++;
    }

    await ensureFinalExam(
      course.id,
      course.title,
      sessions.map((s) => s.title),
    );
    examsCreated++;

    if (courses.indexOf(course) % 20 === 0) {
      console.log(`  ... processed ${courses.indexOf(course) + 1}/${courses.length} courses`);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Courses processed: ${courses.length}`);
  console.log(`   Default sessions created: ${sessionsCreated}`);
  console.log(`   Practice quizzes ensured: ${practiceCreated}`);
  console.log(`   Final exams ensured: ${examsCreated}`);
}

seedAllCourseQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
