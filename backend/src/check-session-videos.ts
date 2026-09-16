import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSessionVideos() {
  console.log('🔍 Checking session videos for Agile course...');

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

    // Find sessions with videos
    const sessions = await prisma.session.findMany({
      where: { courseId: course.id },
      include: {
        videos: true
      }
    });

    console.log(`\n✅ Found ${sessions.length} sessions:\n`);

    sessions.forEach((session, index) => {
      console.log(`Session ${index + 1}: ${session.title}`);
      console.log(`  Videos: ${session.videos.length}`);
      session.videos.forEach((video, vIdx) => {
        console.log(`    ${vIdx + 1}. ${video.title}`);
      });
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking session videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSessionVideos();
