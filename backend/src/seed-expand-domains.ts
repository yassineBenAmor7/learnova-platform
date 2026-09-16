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
};

const DOMAIN_TARGETS: Partial<Record<string, number>> = {
  // → 7 courses
  'HEALTH_WELLNESS': 7,
  'LANGUAGE_COMMUNICATION': 7,
  'LAW_LEGAL': 7,
  'MUSIC_ARTS': 7,
  // → 8 courses
  'HUMANITIES_SOCIAL': 8,
  'LIFESTYLE_HOBBIES': 8,
  'MANAGEMENT': 8,
  'PERSONAL_DEVELOPMENT': 8,
  // → 12 courses
  'ACADEMIC_SCIENCES': 12,
  'SALES_E_COMMERCE': 12,
};

const THUMBNAILS: Partial<Record<string, string>> = {
  'HEALTH_WELLNESS': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
  'LANGUAGE_COMMUNICATION': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
  'LAW_LEGAL': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  'MUSIC_ARTS': 'https://images.unsplash.com/photo-1511379938545-c1f69419868d?auto=format&fit=crop&w=800&q=80',
  'HUMANITIES_SOCIAL': 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80',
  'LIFESTYLE_HOBBIES': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  'MANAGEMENT': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  'PERSONAL_DEVELOPMENT': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
  'ACADEMIC_SCIENCES': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  'SALES_E_COMMERCE': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80',
};

function c(
  title: string,
  description: string,
  domain: string,
  level: CourseLevel = CourseLevel.BEGINNER,
  isPaid = false,
  price = 0,
): CourseSeed {
  return {
    title,
    description,
    level,
    domain,
    thumbnail: THUMBNAILS[domain]!,
    isPaid,
    price,
  };
}

const EXPANSION_COURSES: CourseSeed[] = [
  // HEALTH_WELLNESS → 7 (+4)
  c('Sleep Science & Recovery Optimization', 'Master sleep cycles, circadian rhythms, sleep hygiene protocols, and recovery strategies for peak performance.', 'HEALTH_WELLNESS'),
  c('Mental Health First Aid & Resilience', 'Learn stress coping mechanisms, emotional regulation, crisis support basics, and building psychological resilience.', 'HEALTH_WELLNESS', CourseLevel.INTERMEDIATE),
  c('Plant-Based Nutrition & Meal Planning', 'Design balanced plant-forward diets, macro planning, meal prep workflows, and sustainable eating habits.', 'HEALTH_WELLNESS'),
  c('Sports Injury Prevention & Rehabilitation', 'Understand common sports injuries, warm-up protocols, physiotherapy basics, and safe return-to-play guidelines.', 'HEALTH_WELLNESS', CourseLevel.INTERMEDIATE, true, 29.99),

  // LANGUAGE_COMMUNICATION → 7 (+4)
  c('French for Professional Settings', 'Build business French vocabulary, formal correspondence, meeting phrases, and workplace communication skills.', 'LANGUAGE_COMMUNICATION'),
  c('Technical Writing & Documentation', 'Write clear user manuals, API docs, SOPs, and structured technical content for engineering teams.', 'LANGUAGE_COMMUNICATION', CourseLevel.INTERMEDIATE),
  c('Cross-Cultural Communication in Business', 'Navigate cultural differences, international etiquette, and global team collaboration strategies.', 'LANGUAGE_COMMUNICATION', CourseLevel.INTERMEDIATE),
  c('Debate Skills & Persuasive Argumentation', 'Structure logical arguments, rebuttal techniques, rhetorical devices, and competitive debate formats.', 'LANGUAGE_COMMUNICATION', CourseLevel.ADVANCED),

  // LAW_LEGAL → 7 (+4)
  c('Criminal Law & Justice Systems', 'Study criminal offenses, due process, evidence rules, sentencing frameworks, and court procedures.', 'LAW_LEGAL', CourseLevel.INTERMEDIATE),
  c('Employment Law & Workplace Rights', 'Understand contracts, discrimination law, termination rules, and employee protection regulations.', 'LAW_LEGAL'),
  c('Privacy Law & GDPR Compliance', 'Master data protection principles, GDPR requirements, consent management, and privacy impact assessments.', 'LAW_LEGAL', CourseLevel.INTERMEDIATE, true, 49.99),
  c('Real Estate Law & Property Transactions', 'Analyze property deeds, lease agreements, zoning regulations, and real estate closing procedures.', 'LAW_LEGAL', CourseLevel.INTERMEDIATE),

  // MUSIC_ARTS → 7 (+4)
  c('Guitar Fundamentals & Chord Progressions', 'Learn guitar tuning, basic chords, strumming patterns, and popular song progressions from scratch.', 'MUSIC_ARTS'),
  c('Film Scoring & Sound Design for Cinema', 'Compose cinematic scores, design soundscapes, sync audio to video, and use DAW workflows for film.', 'MUSIC_ARTS', CourseLevel.INTERMEDIATE, true, 44.99),
  c('Watercolor Painting Techniques', 'Master washes, wet-on-wet blending, color layering, and composition for expressive watercolor art.', 'MUSIC_ARTS'),
  c('Theatre Acting & Stage Performance', 'Develop character building, voice projection, stage blocking, and live performance confidence.', 'MUSIC_ARTS', CourseLevel.INTERMEDIATE),

  // HUMANITIES_SOCIAL → 8 (+5)
  c('Anthropology & Cultural Studies', 'Explore human societies, cultural rituals, ethnographic methods, and cross-cultural comparison frameworks.', 'HUMANITIES_SOCIAL', CourseLevel.INTERMEDIATE),
  c('Political Science & Governance', 'Study political systems, electoral processes, public policy design, and international relations theory.', 'HUMANITIES_SOCIAL'),
  c('World Literature & Critical Analysis', 'Analyze classic and contemporary texts, literary devices, narrative theory, and comparative literature.', 'HUMANITIES_SOCIAL', CourseLevel.INTERMEDIATE),
  c('Gender Studies & Social Identity', 'Examine gender roles, identity politics, intersectionality, and social movements through a critical lens.', 'HUMANITIES_SOCIAL', CourseLevel.INTERMEDIATE),
  c('Archaeology & Ancient Civilizations', 'Investigate excavation methods, artifact analysis, and the rise of Mesopotamian, Egyptian, and Roman empires.', 'HUMANITIES_SOCIAL'),

  // LIFESTYLE_HOBBIES → 8 (+5)
  c('Home Baking & Pastry Arts', 'Master bread dough, laminated pastries, cake decorating, and professional baking techniques at home.', 'LIFESTYLE_HOBBIES'),
  c('Woodworking & DIY Craftsmanship', 'Learn tool safety, joinery techniques, furniture building, and finishing methods for wood projects.', 'LIFESTYLE_HOBBIES', CourseLevel.INTERMEDIATE),
  c('Wine Tasting & Sommelier Basics', 'Develop palate training, wine regions knowledge, food pairing principles, and service standards.', 'LIFESTYLE_HOBBIES', CourseLevel.INTERMEDIATE, true, 34.99),
  c('Interior Design for Small Spaces', 'Optimize layouts, color schemes, furniture selection, and lighting for compact living environments.', 'LIFESTYLE_HOBBIES'),
  c('Chess Strategy & Tactical Thinking', 'Learn openings, middlegame tactics, endgame patterns, and competitive chess improvement methods.', 'LIFESTYLE_HOBBIES'),

  // MANAGEMENT → 8 (+5)
  c('Change Management & Organizational Transformation', 'Lead digital and cultural transformations using Kotter, ADKAR, and stakeholder engagement models.', 'MANAGEMENT', CourseLevel.INTERMEDIATE),
  c('Risk Management & Business Continuity', 'Identify operational risks, build mitigation plans, and design business continuity frameworks.', 'MANAGEMENT', CourseLevel.ADVANCED, true, 59.99),
  c('Operations Management & Supply Chain', 'Optimize production flows, inventory control, logistics networks, and lean operations principles.', 'MANAGEMENT', CourseLevel.INTERMEDIATE),
  c('HR Management & Talent Acquisition', 'Design hiring pipelines, performance reviews, compensation structures, and employee engagement programs.', 'MANAGEMENT'),
  c('Remote Team Leadership & Hybrid Work', 'Manage distributed teams, async communication, virtual collaboration tools, and hybrid culture building.', 'MANAGEMENT', CourseLevel.INTERMEDIATE),

  // PERSONAL_DEVELOPMENT → 8 (+5)
  c('Critical Thinking & Problem Solving', 'Apply logical reasoning, root cause analysis, decision matrices, and structured problem-solving frameworks.', 'PERSONAL_DEVELOPMENT'),
  c('Financial Literacy for Personal Wealth', 'Budget effectively, manage debt, invest wisely, and build long-term personal financial security.', 'PERSONAL_DEVELOPMENT', CourseLevel.INTERMEDIATE),
  c('Confidence Building & Self-Esteem', 'Overcome imposter syndrome, develop assertiveness, and build authentic self-confidence in social settings.', 'PERSONAL_DEVELOPMENT'),
  c('Networking & Personal Branding', 'Build professional networks, optimize LinkedIn presence, and craft a compelling personal brand story.', 'PERSONAL_DEVELOPMENT', CourseLevel.INTERMEDIATE),
  c('Work-Life Balance & Burnout Prevention', 'Set boundaries, manage energy cycles, recognize burnout signals, and design sustainable work routines.', 'PERSONAL_DEVELOPMENT'),

  // ACADEMIC_SCIENCES → 12 (+9)
  c('Organic Chemistry & Laboratory Methods', 'Study functional groups, reaction mechanisms, spectroscopy, and safe organic chemistry lab techniques.', 'ACADEMIC_SCIENCES', CourseLevel.ADVANCED, true, 69.99),
  c('Astronomy & Astrophysics Fundamentals', 'Explore celestial mechanics, stellar evolution, galaxies, telescopes, and the scale of the universe.', 'ACADEMIC_SCIENCES'),
  c('Environmental Science & Climate Change', 'Analyze ecosystems, pollution, renewable energy, carbon cycles, and climate policy responses.', 'ACADEMIC_SCIENCES', CourseLevel.INTERMEDIATE),
  c('Statistics & Probability for Research', 'Apply descriptive statistics, hypothesis testing, regression, and probability distributions in research.', 'ACADEMIC_SCIENCES', CourseLevel.INTERMEDIATE),
  c('Neuroscience & Brain Function', 'Understand neurons, synaptic transmission, brain regions, memory systems, and cognitive neuroscience.', 'ACADEMIC_SCIENCES', CourseLevel.ADVANCED, true, 79.99),
  c('Microbiology & Infectious Diseases', 'Study bacteria, viruses, immune responses, epidemiology, and antimicrobial resistance mechanisms.', 'ACADEMIC_SCIENCES', CourseLevel.INTERMEDIATE),
  c('Geology & Earth Systems Science', 'Explore plate tectonics, rock cycles, mineral formation, earthquakes, and planetary geology.', 'ACADEMIC_SCIENCES'),
  c('Research Methods & Scientific Writing', 'Design experiments, write peer-reviewed papers, cite sources properly, and present research findings.', 'ACADEMIC_SCIENCES', CourseLevel.INTERMEDIATE),
  c('Data Science for Scientific Research', 'Use Python, pandas, and visualization tools to analyze scientific datasets and publish results.', 'ACADEMIC_SCIENCES', CourseLevel.ADVANCED, true, 89.99),

  // SALES_E_COMMERCE → 12 (+9)
  c('Amazon FBA Mastery & Product Launch', 'Source products, optimize listings, manage FBA inventory, and scale Amazon seller accounts profitably.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE, true, 59.99),
  c('Dropshipping Business Blueprint', 'Build a dropshipping store, select suppliers, run ads, and automate order fulfillment workflows.', 'SALES_E_COMMERCE'),
  c('Social Commerce & Instagram Shopping', 'Sell on Instagram and TikTok, create shoppable content, and drive social media conversions.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE),
  c('CRM Systems & Sales Pipeline Automation', 'Configure HubSpot/Salesforce pipelines, automate follow-ups, and track deal stages effectively.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE, true, 49.99),
  c('Pricing Strategy & Revenue Optimization', 'Apply value-based pricing, dynamic pricing models, discount psychology, and margin analysis.', 'SALES_E_COMMERCE', CourseLevel.ADVANCED),
  c('Customer Retention & Loyalty Programs', 'Design loyalty tiers, reduce churn, increase LTV, and build recurring revenue from existing customers.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE),
  c('Wholesale & B2B Marketplace Selling', 'Negotiate wholesale deals, list on B2B marketplaces, and manage bulk order fulfillment.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE),
  c('Conversion Rate Optimization (CRO)', 'Run A/B tests, optimize landing pages, reduce cart abandonment, and improve checkout flows.', 'SALES_E_COMMERCE', CourseLevel.ADVANCED, true, 54.99),
  c('Sales Analytics & Forecasting with Excel', 'Build sales dashboards, forecast revenue, analyze cohorts, and report KPIs to leadership teams.', 'SALES_E_COMMERCE', CourseLevel.INTERMEDIATE),
];

async function createFullCourse(cData: CourseSeed, creatorId: number) {
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

  const session = await prisma.session.create({
    data: {
      title: `Session 1: Introduction to ${cData.title.split(':')[0]}`,
      description: cData.description.slice(0, 120),
      orderNumber: 1,
      content: `### Course Overview\n${cData.description}`,
      courseId: newCourse.id,
    },
  });

  await prisma.video.create({
    data: {
      title: `${cData.title} — Overview`,
      url: 'https://www.youtube.com/watch?v=GwIo3gDZUtQ',
      duration: 900,
      orderNumber: 1,
      sessionId: session.id,
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: `${cData.title} — Assessment`,
      description: `Evaluate your understanding of ${cData.title}.`,
      passingScore: 70,
      isExamMode: true,
      courseId: newCourse.id,
    },
  });

  const question = await prisma.question.create({
    data: {
      text: `What is the primary focus of "${cData.title}"?`,
      quizId: quiz.id,
    },
  });

  await prisma.questionOption.createMany({
    data: [
      { text: cData.description.slice(0, 80), isCorrect: true, questionId: question.id },
      { text: 'Unrelated topic with no connection to this course', isCorrect: false, questionId: question.id },
    ],
  });
}

async function seedExpandDomains() {
  console.log('🌱 Expanding domains to targets: 7, 8, and 12 courses...\n');

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

  for (const cData of EXPANSION_COURSES) {
    const target = DOMAIN_TARGETS[cData.domain];
    if (!target) continue;

    const currentCount = countMap[cData.domain] || 0;
    if (currentCount >= target) {
      skipped++;
      continue;
    }

    const existing = await prisma.course.findFirst({ where: { title: cData.title } });
    if (existing) {
      skipped++;
      continue;
    }

    console.log(`🚀 [${cData.domain}] "${cData.title}" (${currentCount + 1}/${target})`);
    await createFullCourse(cData, creator.id);
    countMap[cData.domain] = (countMap[cData.domain] || 0) + 1;
    created++;
  }

  console.log('\n📊 Final courses per domain:');
  const finalCounts = await prisma.course.groupBy({
    by: ['domain'],
    _count: { id: true },
  });

  finalCounts
    .sort((a, b) => a.domain.localeCompare(b.domain))
    .forEach((row) => {
      const target = DOMAIN_TARGETS[row.domain as string];
      const marker = target
        ? row._count.id >= target
          ? '✓'
          : '✗'
        : row._count.id >= 3
          ? '·'
          : '✗';
      const targetLabel = target ? ` (target: ${target})` : '';
      console.log(`   ${marker} ${row.domain}: ${row._count.id}${targetLabel}`);
    });

  console.log(`\n🎉 Created ${created}, skipped ${skipped}.`);
}

seedExpandDomains()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
