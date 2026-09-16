import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentVideos() {
  console.log('🔍 Checking current video URLs in database...\n');

  try {
    const videos = await prisma.video.findMany({
      take: 20,
      include: {
        session: {
          select: {
            title: true
          }
        }
      }
    });

    console.log(`✅ Found ${videos.length} videos\n`);

    videos.forEach((video, index) => {
      console.log(`${index + 1}. Session: ${video.session.title}`);
      console.log(`   URL: ${video.url}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentVideos();
