import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_DOMAIN_COURSES = [
  {
    title: 'Mindfulness, Yoga & Stress Management',
    description: 'Learn breathing techniques, meditation routines, yoga fundamentals, and evidence-based strategies to reduce stress and improve mental wellbeing.',
    level: CourseLevel.BEGINNER,
    domain: 'HEALTH_WELLNESS',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Breathwork & Mindfulness Foundations',
        description: 'Practice diaphragmatic breathing, body scans, and daily mindfulness routines.',
        orderNumber: 1,
        content: '### Mindfulness Basics\nUnderstand the nervous system response to stress and how intentional breathing activates the parasympathetic system.',
        videos: [
          {
            title: 'Guided Mindfulness for Beginners',
            url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
            duration: 600,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Stress Management Assessment',
      description: 'Test your understanding of mindfulness and relaxation techniques.',
      passingScore: 70,
      questions: [
        {
          text: 'Which breathing pattern is commonly used to activate the relaxation response?',
          options: [
            { text: 'Slow diaphragmatic breathing', isCorrect: true },
            { text: 'Rapid shallow chest breathing', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Effective Communication & Emotional Intelligence',
    description: 'Develop active listening, empathy, conflict resolution, and leadership communication skills for personal and professional growth.',
    level: CourseLevel.INTERMEDIATE,
    domain: 'PERSONAL_DEVELOPMENT',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 24.99,
    sessions: [
      {
        title: 'Session 1: Active Listening & Empathy in Dialogue',
        description: 'Master reflective listening, non-verbal cues, and emotional validation techniques.',
        orderNumber: 1,
        content: '### Communication Frameworks\nLearn the DESC model (Describe, Express, Specify, Consequences) for constructive feedback.',
        videos: [
          {
            title: 'Active Listening Skills Explained',
            url: 'https://www.youtube.com/watch?v=7wUCyj5Ruf4',
            duration: 720,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Emotional Intelligence Quiz',
      description: 'Evaluate your communication and empathy knowledge.',
      passingScore: 70,
      questions: [
        {
          text: 'What is the primary goal of active listening?',
          options: [
            { text: 'To fully understand the speaker before responding', isCorrect: true },
            { text: 'To prepare your counter-argument while they talk', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Introduction to Physics & Chemistry',
    description: 'Explore classical mechanics, thermodynamics, atomic structure, chemical bonding, and laboratory safety for science students.',
    level: CourseLevel.BEGINNER,
    domain: 'ACADEMIC_SCIENCES',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Newtonian Mechanics & Motion Laws',
        description: 'Understand force, mass, acceleration, and the three laws of motion.',
        orderNumber: 1,
        content: '### Physics Foundations\nF = ma is the cornerstone of classical mechanics. Apply vector decomposition to real-world motion problems.',
        videos: [
          {
            title: "Newton's Laws of Motion",
            url: 'https://www.youtube.com/watch?v=kKKM8qU06os',
            duration: 900,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Physics Fundamentals Exam',
      description: 'Test your knowledge of basic mechanics.',
      passingScore: 70,
      questions: [
        {
          text: "Which law states that every action has an equal and opposite reaction?",
          options: [
            { text: "Newton's Third Law", isCorrect: true },
            { text: "Newton's First Law", isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Digital Illustration & Creative Drawing',
    description: 'Master digital art fundamentals, color theory, composition, and illustration workflows using professional creative tools.',
    level: CourseLevel.BEGINNER,
    domain: 'MUSIC_ARTS',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 34.99,
    sessions: [
      {
        title: 'Session 1: Digital Canvas Setup & Brush Techniques',
        description: 'Configure layers, brushes, and color palettes for digital illustration.',
        orderNumber: 1,
        content: '### Digital Art Workflow\nLearn layer blending modes, opacity control, and non-destructive editing for professional illustrations.',
        videos: [
          {
            title: 'Digital Drawing for Beginners',
            url: 'https://www.youtube.com/watch?v=ewMksMbY0cc',
            duration: 840,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Digital Art Basics Quiz',
      description: 'Verify your illustration fundamentals.',
      passingScore: 70,
      questions: [
        {
          text: 'What is the main advantage of using layers in digital art?',
          options: [
            { text: 'Non-destructive editing and flexible composition', isCorrect: true },
            { text: 'Automatic color correction of all elements', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'B2B Sales & Negotiation Mastery',
    description: 'Learn enterprise sales cycles, pipeline management, objection handling, and win-win negotiation frameworks for B2B deals.',
    level: CourseLevel.INTERMEDIATE,
    domain: 'SALES_E_COMMERCE',
    thumbnail: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 49.99,
    sessions: [
      {
        title: 'Session 1: B2B Sales Pipeline & Discovery Calls',
        description: 'Map the enterprise buyer journey, qualify leads, and run effective discovery conversations.',
        orderNumber: 1,
        content: '### B2B Sales Process\nUnderstand MEDDIC qualification (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion).',
        videos: [
          {
            title: 'B2B Sales Process Explained',
            url: 'https://www.youtube.com/watch?v=9Ppf9GoCzOc',
            duration: 960,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'B2B Sales Assessment',
      description: 'Test your sales pipeline and negotiation knowledge.',
      passingScore: 70,
      questions: [
        {
          text: 'What is the purpose of a discovery call in B2B sales?',
          options: [
            { text: 'To understand the prospect pain points and qualify the opportunity', isCorrect: true },
            { text: 'To immediately close the deal without questions', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Introduction to Psychology & Sociology',
    description: 'Study human behavior, cognitive processes, social structures, cultural dynamics, and research methods in the social sciences.',
    level: CourseLevel.BEGINNER,
    domain: 'HUMANITIES_SOCIAL',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Cognitive Psychology & Social Behavior',
        description: 'Explore memory, perception, group dynamics, and social influence.',
        orderNumber: 1,
        content: '### Social Science Foundations\nUnderstand how individual cognition interacts with social norms, institutions, and cultural context.',
        videos: [
          {
            title: 'Introduction to Psychology',
            url: 'https://www.youtube.com/watch?v=vo4pMVb0R6M',
            duration: 780,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Psychology & Sociology Quiz',
      description: 'Evaluate your social science fundamentals.',
      passingScore: 70,
      questions: [
        {
          text: 'Which field primarily studies how groups and societies influence individual behavior?',
          options: [
            { text: 'Sociology', isCorrect: true },
            { text: 'Organic Chemistry', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Business Law & Corporate Governance',
    description: 'Understand corporate structures, shareholder rights, regulatory compliance, fiduciary duties, and board governance best practices.',
    level: CourseLevel.ADVANCED,
    domain: 'LAW_LEGAL',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    isPaid: true,
    price: 79.99,
    sessions: [
      {
        title: 'Session 1: Corporate Structures & Director Duties',
        description: 'Analyze LLC vs corporation models, fiduciary obligations, and compliance frameworks.',
        orderNumber: 1,
        content: '### Corporate Governance\nDirectors owe duties of care, loyalty, and good faith to shareholders and stakeholders.',
        videos: [
          {
            title: 'Corporate Governance Explained',
            url: 'https://www.youtube.com/watch?v=nzj7Wg46zgA',
            duration: 900,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Corporate Law Assessment',
      description: 'Test your governance and compliance knowledge.',
      passingScore: 75,
      questions: [
        {
          text: 'What fiduciary duty requires directors to act in the best interest of the company?',
          options: [
            { text: 'Duty of loyalty', isCorrect: true },
            { text: 'Duty of publicity', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    title: 'Gardening & Sustainable Living',
    description: 'Learn organic gardening, composting, urban farming, seasonal planting, and eco-friendly lifestyle practices for everyday life.',
    level: CourseLevel.BEGINNER,
    domain: 'LIFESTYLE_HOBBIES',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    isPaid: false,
    price: 0,
    sessions: [
      {
        title: 'Session 1: Organic Gardening & Composting Basics',
        description: 'Set up raised beds, choose seasonal crops, and build a home compost system.',
        orderNumber: 1,
        content: '### Sustainable Gardening\nBalance nitrogen-rich greens and carbon-rich browns in compost for nutrient-dense soil.',
        videos: [
          {
            title: 'Organic Gardening for Beginners',
            url: 'https://www.youtube.com/watch?v=Wvf0N0qJhBw',
            duration: 720,
            orderNumber: 1,
          },
        ],
      },
    ],
    quiz: {
      title: 'Sustainable Living Quiz',
      description: 'Verify your gardening and composting knowledge.',
      passingScore: 70,
      questions: [
        {
          text: 'What is compost primarily used for in gardening?',
          options: [
            { text: 'Enriching soil with organic nutrients', isCorrect: true },
            { text: 'Preventing all plant diseases permanently', isCorrect: false },
          ],
        },
      ],
    },
  },
];

async function seed8NewDomains() {
  console.log('🌱 Seeding courses for the 8 new domains (exclusive domain assignment)...');

  const creator =
    (await prisma.user.findFirst({ where: { role: { name: 'ADMIN' } } })) ||
    (await prisma.user.findFirst());

  if (!creator) {
    console.error('❌ No user found. Register an admin user first.');
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const cData of NEW_DOMAIN_COURSES) {
    const existing = await prisma.course.findFirst({
      where: { title: cData.title },
    });

    if (existing) {
      console.log(`⏭️  Skipping "${cData.title}" — already exists in ${existing.domain}`);
      skipped++;
      continue;
    }

    console.log(`🚀 Creating "${cData.title}" → ${cData.domain}...`);

    const newCourse = await prisma.course.create({
      data: {
        title: cData.title,
        description: cData.description,
        level: cData.level,
        domain: cData.domain,
        thumbnail: cData.thumbnail,
        creatorId: creator.id,
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

    if (cData.quiz) {
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
            data: {
              text: oData.text,
              isCorrect: oData.isCorrect,
              questionId: question.id,
            },
          });
        }
      }
    }

    created++;
    console.log(`✅ Created "${cData.title}" in domain ${cData.domain}`);
  }

  const domainCounts = await prisma.course.groupBy({
    by: ['domain'],
    _count: { id: true },
  });

  console.log('\n📊 Courses per domain:');
  domainCounts
    .sort((a, b) => a.domain.localeCompare(b.domain))
    .forEach((row) => console.log(`   ${row.domain}: ${row._count.id}`));

  console.log(`\n🎉 Done! Created ${created}, skipped ${skipped}.`);
}

seed8NewDomains()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
