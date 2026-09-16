import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllCourses() {
  console.log('🔍 Checking all courses and their sessions...');

  try {
    const courses = await prisma.course.findMany({
      include: {
        sessions: {
          include: {
            videos: true
          },
          orderBy: { orderNumber: 'asc' }
        }
      }
    });

    console.log(`✅ Found ${courses.length} courses:\n`);

    courses.forEach((course, cIdx) => {
      console.log(`Course ${cIdx + 1}: ${course.title}`);
      console.log(`  Sessions: ${course.sessions.length}`);
      
      course.sessions.forEach((session, sIdx) => {
        console.log(`    Session ${sIdx + 1}: ${session.title}`);
        console.log(`      Videos: ${session.videos.length}`);
        session.videos.forEach((video, vIdx) => {
          console.log(`        ${vIdx + 1}. ${video.title}`);
        });
      });
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllCourses();
