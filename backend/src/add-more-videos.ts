import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMoreVideos() {
  console.log('🔄 Adding more videos to Agile session...');

  try {
    // Find the Agile course
    const course = await prisma.course.findFirst({
      where: { title: { contains: 'Agile' } }
    });

    if (!course) {
      console.error('❌ Agile course not found.');
      return;
    }

    console.log(`✅ Found course: ${course.title}`);

    // Find the session
    const session = await prisma.session.findFirst({
      where: { courseId: course.id }
    });

    if (!session) {
      console.error('❌ Session not found.');
      return;
    }

    console.log(`✅ Found session: ${session.title}`);

    // Add more videos
    const videos = [
      {
        title: 'Chapter 2: Scrum Roles and Responsibilities',
        url: 'https://www.youtube.com/watch?v=example2',
        duration: 600,
        orderNumber: 2,
        sessionId: session.id,
        content: 'This chapter covers the three Scrum roles: Product Owner, Scrum Master, and Development Team. Learn about their responsibilities and how they work together.',
        description: 'Understanding Scrum roles and their interactions'
      },
      {
        title: 'Chapter 3: Scrum Events',
        url: 'https://www.youtube.com/watch?v=example3',
        duration: 720,
        orderNumber: 3,
        sessionId: session.id,
        content: 'This chapter explains the five Scrum events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective.',
        description: 'Overview of all Scrum events and their purposes'
      },
      {
        title: 'Chapter 4: Scrum Artifacts',
        url: 'https://www.youtube.com/watch?v=example4',
        duration: 540,
        orderNumber: 4,
        sessionId: session.id,
        content: 'This chapter covers the three Scrum artifacts: Product Backlog, Sprint Backlog, and Increment. Learn how they provide transparency and inspection.',
        description: 'Understanding Scrum artifacts and their relationships'
      }
    ];

    for (const video of videos) {
      const created = await prisma.video.create({
        data: video
      });
      console.log(`✅ Created video: ${created.title}`);
    }

    console.log('🎉 Videos added successfully!');
  } catch (error) {
    console.error('❌ Error adding videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreVideos();
