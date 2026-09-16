import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVideoContent() {
  console.log('🔍 Checking video content for Agile course...');

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

    // Find sessions for this course
    const sessions = await prisma.session.findMany({
      where: { courseId: course.id },
      include: {
        videos: true
      }
    });

    console.log(`\n✅ Found ${sessions.length} sessions:\n`);

    sessions.forEach((session, sIdx) => {
      console.log(`Session ${sIdx + 1}: ${session.title}`);
      console.log(`Videos: ${session.videos.length}`);
      
      session.videos.forEach((video, vIdx) => {
        console.log(`  Video ${vIdx + 1}: ${video.title}`);
        console.log(`    Has content: ${video.content ? 'Yes' : 'No'}`);
        console.log(`    Has description: ${video.description ? 'Yes' : 'No'}`);
        if (video.content) {
          console.log(`    Content length: ${video.content.length} chars`);
        }
        if (video.description) {
          console.log(`    Description: ${video.description}`);
        }
      });
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking video content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVideoContent();
