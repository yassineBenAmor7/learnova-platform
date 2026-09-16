import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

type CourseSeed = {
  title: string;
  description: string;
  level: CourseLevel;
  domain: string;
  thumbnail: string;
  isPaid: boolean;
  price: number;
  sessions: Array<{
    title: string;
    description: string;
    orderNumber: number;
    content: string;
    videos: Array<{ title: string; url: string; duration: number; orderNumber: number }>;
  }>;
  quiz: {
    title: string;
    description: string;
    passingScore: number;
    questions: Array<{
      text: string;
      options: Array<{ text: string; isCorrect: boolean }>;
    }>;
  };
};

const ADDITIONAL_COURSES: CourseSeed[] = [
  {
    title: 'Fitness Training & Exercise Science',
    description: 'Build strength programs, understand biomechanics, recovery protocols, and evidence-based workout planning for long-term health.',
    level: CourseLevel.BEGINNER,
    domain: 'HEALTH_WELLNESS',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Strength Training Fundamentals',
        description: 'Learn progressive overload, compound movements, and safe form techniques.',
        orderNumber: 1,
        content: '### Exercise Science Basics\nUnderstand muscle groups, rep ranges, and recovery windows for sustainable fitness.',
        videos: [{ title: 'Strength Training for Beginners', url: 'https://www.youtube.com/watch?v=Gc4HomXgrN4', duration: 720, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Fitness Fundamentals Quiz',
      description: 'Test your exercise science knowledge.',
      passingScore: 70,
      questions: [{ text: 'What principle requires gradually increasing training load over time?', options: [{ text: 'Progressive overload', isCorrect: true }, { text: 'Static equilibrium', isCorrect: false }] }],
    },
  },
  {
    title: 'Goal Setting & Personal Leadership',
    description: 'Master SMART goals, habit stacking, accountability systems, and leadership mindsets for lasting personal transformation.',
    level: CourseLevel.BEGINNER,
    domain: 'PERSONAL_DEVELOPMENT',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: SMART Goals & Execution Systems',
        description: 'Define measurable objectives and build weekly review rituals.',
        orderNumber: 1,
        content: '### Goal Framework\nSpecific, Measurable, Achievable, Relevant, Time-bound — applied to career and life planning.',
        videos: [{ title: 'How to Set SMART Goals', url: 'https://www.youtube.com/watch?v=1-SJGQ2HLl8', duration: 600, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Personal Leadership Assessment',
      description: 'Evaluate your goal-setting skills.',
      passingScore: 70,
      questions: [{ text: 'What does the M in SMART goals stand for?', options: [{ text: 'Measurable', isCorrect: true }, { text: 'Mandatory', isCorrect: false }] }],
    },
  },
  {
    title: 'Biology & Genetics Fundamentals',
    description: 'Explore cell biology, DNA replication, gene expression, evolution, and laboratory methods in modern life sciences.',
    level: CourseLevel.INTERMEDIATE,
    domain: 'ACADEMIC_SCIENCES',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9db581962?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 39.99,
    sessions: [
      {
        title: 'Session 1: DNA Structure & Gene Expression',
        description: 'Understand nucleotides, transcription, translation, and protein synthesis.',
        orderNumber: 1,
        content: '### Molecular Biology\nCentral dogma: DNA → RNA → Protein. Explore codons, ribosomes, and mutation types.',
        videos: [{ title: 'DNA and RNA Explained', url: 'https://www.youtube.com/watch?v=8kK2zwjRV0M', duration: 840, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Biology Fundamentals Exam',
      description: 'Test your genetics knowledge.',
      passingScore: 70,
      questions: [{ text: 'Which molecule carries genetic information in most organisms?', options: [{ text: 'DNA', isCorrect: true }, { text: 'ATP', isCorrect: false }] }],
    },
  },
  {
    title: 'Piano & Music Theory for Beginners',
    description: 'Learn music notation, scales, chord progressions, rhythm patterns, and piano technique from scratch.',
    level: CourseLevel.BEGINNER,
    domain: 'MUSIC_ARTS',
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f94555?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Reading Sheet Music & Scales',
        description: 'Decode treble and bass clefs, major scales, and basic chord structures.',
        orderNumber: 1,
        content: '### Music Theory Foundations\nIntervals, key signatures, and the circle of fifths for harmonic understanding.',
        videos: [{ title: 'Music Theory for Beginners', url: 'https://www.youtube.com/watch?v=6Ml0Y2E4K7E', duration: 900, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Music Theory Quiz',
      description: 'Verify your notation and scale knowledge.',
      passingScore: 70,
      questions: [{ text: 'How many notes are in a standard major scale?', options: [{ text: '7 (plus octave)', isCorrect: true }, { text: '5', isCorrect: false }] }],
    },
  },
  {
    title: 'Retail Sales & Customer Experience',
    description: 'Master in-store selling techniques, customer journey mapping, upselling strategies, and loyalty program design.',
    level: CourseLevel.BEGINNER,
    domain: 'SALES_E_COMMERCE',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Customer Journey & Upselling',
        description: 'Map touchpoints from awareness to purchase and design cross-sell offers.',
        orderNumber: 1,
        content: '### Retail Sales Framework\nApply the SPIN selling method: Situation, Problem, Implication, Need-payoff.',
        videos: [{ title: 'Retail Sales Techniques', url: 'https://www.youtube.com/watch?v=9Ppf9GoCzOc', duration: 780, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Retail Sales Assessment',
      description: 'Test your customer experience knowledge.',
      passingScore: 70,
      questions: [{ text: 'What does upselling primarily aim to do?', options: [{ text: 'Offer a higher-value alternative or add-on', isCorrect: true }, { text: 'Reduce product prices', isCorrect: false }] }],
    },
  },
  {
    title: 'Philosophy & Ethics in Modern Society',
    description: 'Study major philosophical traditions, moral reasoning, applied ethics, and critical thinking in contemporary debates.',
    level: CourseLevel.INTERMEDIATE,
    domain: 'HUMANITIES_SOCIAL',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Ethical Frameworks & Moral Reasoning',
        description: 'Compare utilitarianism, deontology, and virtue ethics in real-world dilemmas.',
        orderNumber: 1,
        content: '### Ethics Foundations\nAnalyze trolley problems, AI ethics, and corporate social responsibility through philosophical lenses.',
        videos: [{ title: 'Introduction to Ethics', url: 'https://www.youtube.com/watch?v=BoDKwRREVeI', duration: 720, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Philosophy & Ethics Quiz',
      description: 'Evaluate your ethical reasoning skills.',
      passingScore: 70,
      questions: [{ text: 'Which ethical theory focuses on the greatest good for the greatest number?', options: [{ text: 'Utilitarianism', isCorrect: true }, { text: 'Existentialism', isCorrect: false }] }],
    },
  },
  {
    title: 'International Law & Human Rights',
    description: 'Understand treaties, international courts, humanitarian law, refugee rights, and global governance institutions.',
    level: CourseLevel.ADVANCED,
    domain: 'LAW_LEGAL',
    thumbnail: 'https://images.unsplash.com/photo-1589391886645-d51941baf700?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 69.99,
    sessions: [
      {
        title: 'Session 1: UN Charter & Human Rights Conventions',
        description: 'Explore the Universal Declaration of Human Rights and international treaty mechanisms.',
        orderNumber: 1,
        content: '### International Legal Order\nSources of international law: treaties, custom, general principles, and judicial decisions.',
        videos: [{ title: 'International Human Rights Law', url: 'https://www.youtube.com/watch?v=nzj7Wg46zgA', duration: 900, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'International Law Assessment',
      description: 'Test your human rights law knowledge.',
      passingScore: 75,
      questions: [{ text: 'Which document is the foundational global human rights declaration adopted in 1948?', options: [{ text: 'Universal Declaration of Human Rights', isCorrect: true }, { text: 'Geneva Convention of 1929', isCorrect: false }] }],
    },
  },
  {
    title: 'Travel Photography & Adventure Planning',
    description: 'Capture stunning travel photos, plan itineraries, budget adventures, and tell visual stories from around the world.',
    level: CourseLevel.BEGINNER,
    domain: 'LIFESTYLE_HOBBIES',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Travel Photography Composition',
        description: 'Master rule of thirds, golden hour lighting, and storytelling through photo series.',
        orderNumber: 1,
        content: '### Travel Photography Tips\nPack light, scout locations, and use leading lines for compelling travel narratives.',
        videos: [{ title: 'Travel Photography Tips', url: 'https://www.youtube.com/watch?v=6v2L2UGZhmA', duration: 660, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Travel Photography Quiz',
      description: 'Verify your composition knowledge.',
      passingScore: 70,
      questions: [{ text: 'What is the golden hour in photography?', options: [{ text: 'The period shortly after sunrise or before sunset', isCorrect: true }, { text: 'Midday when the sun is highest', isCorrect: false }] }],
    },
  },
  {
    title: 'Spanish Conversation Skills for Beginners',
    description: 'Build conversational Spanish with essential vocabulary, pronunciation, grammar patterns, and real-life dialogue practice.',
    level: CourseLevel.BEGINNER,
    domain: 'LANGUAGE_COMMUNICATION',
    thumbnail: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Greetings, Numbers & Daily Phrases',
        description: 'Learn common greetings, introductions, and everyday conversational patterns.',
        orderNumber: 1,
        content: '### Spanish Basics\nMaster ser vs estar, gendered nouns, and present tense conjugations for daily use.',
        videos: [{ title: 'Spanish for Beginners', url: 'https://www.youtube.com/watch?v=QXKnGyHR1MM', duration: 1200, orderNumber: 1 }],
      },
    ],
    quiz: {
      title: 'Spanish Basics Quiz',
      description: 'Test your beginner Spanish vocabulary.',
      passingScore: 70,
      questions: [{ text: 'How do you say "Hello" in Spanish?', options: [{ text: 'Hola', isCorrect: true }, { text: 'Bonjour', isCorrect: false }] }],
    },
  },
];

async function createCourse(cData: CourseSeed, creatorId: number) {
  const newCourse = await prisma.course.create({
    data: {
      title: cData.title,
      description: cData.description,
      level: cData.level,
      domain: cData.domain,
      thumbnail: cData.thumbnail,
      creatorId,
      isPaid: cData.isPaid,
      price: cData.price,
    },
  });

  for (const sData of cData.sessions) {
    const session = await prisma.session.create({
      data: {
        title: sData.title,
        description: sData.description,
        orderNumber: sData.orderNumber,
        content: sData.content,
        courseId: newCourse.id,
      },
    });

    for (const vData of sData.videos) {
      await prisma.video.create({
        data: {
          title: vData.title,
          url: vData.url,
          duration: vData.duration,
          orderNumber: vData.orderNumber,
          sessionId: session.id,
        },
      });
    }
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: cData.quiz.title,
      description: cData.quiz.description,
      passingScore: cData.quiz.passingScore,
      isExamMode: true,
      courseId: newCourse.id,
    },
  });

  for (const questionData of cData.quiz.questions) {
    const question = await prisma.question.create({
      data: { text: questionData.text, quizId: quiz.id },
    });

    for (const oData of questionData.options) {
      await prisma.questionOption.create({
        data: { text: oData.text, isCorrect: oData.isCorrect, questionId: question.id },
      });
    }
  }
}

async function seedMin3PerDomain() {
  console.log('🌱 Ensuring at least 3 courses per domain...\n');

  const creator =
    (await prisma.user.findFirst({ where: { role: { name: 'ADMIN' } } })) ||
    (await prisma.user.findFirst());

  if (!creator) {
    console.error('❌ No user found. Register an admin user first.');
    return;
  }

  const counts = await prisma.course.groupBy({
    by: ['domain'],
    _count: { id: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.domain, c._count.id]));

  let created = 0;
  let skipped = 0;

  for (const cData of ADDITIONAL_COURSES) {
    const currentCount = countMap[cData.domain] || 0;
    if (currentCount >= 3) {
      console.log(`✅ ${cData.domain} already has ${currentCount} courses — skipping "${cData.title}"`);
      skipped++;
      continue;
    }

    const existing = await prisma.course.findFirst({ where: { title: cData.title } });
    if (existing) {
      console.log(`⏭️  "${cData.title}" already exists`);
      skipped++;
      countMap[cData.domain] = (countMap[cData.domain] || 0) + 1;
      continue;
    }

    console.log(`🚀 Creating "${cData.title}" → ${cData.domain} (was ${currentCount}, target 3)...`);
    await createCourse(cData, creator.id);
    countMap[cData.domain] = (countMap[cData.domain] || 0) + 1;
    created++;
  }

  const finalCounts = await prisma.course.groupBy({
    by: ['domain'],
    _count: { id: true },
  });

  console.log('\n📊 Final courses per domain:');
  finalCounts
    .sort((a, b) => a.domain.localeCompare(b.domain))
    .forEach((row) => {
      const ok = row._count.id >= 3 ? '✓' : '✗';
      console.log(`   ${ok} ${row.domain}: ${row._count.id}`);
    });

  const belowMin = finalCounts.filter((r) => r._count.id < 3);
  if (belowMin.length) {
    console.log('\n⚠️  Domains still below 3:', belowMin.map((r) => r.domain).join(', '));
  } else {
    console.log('\n🎉 All domains have at least 3 courses!');
  }

  console.log(`\nCreated ${created}, skipped ${skipped}.`);
}

seedMin3PerDomain()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
