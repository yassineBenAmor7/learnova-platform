import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVideos() {
  console.log('🔍 Checking video URLs...');

  try {
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        url: true
      },
      take: 20 // Check first 20 videos for sample
    });

    console.log(`✅ Checking ${videos.length} videos\n`);

    let validCount = 0;
    let invalidCount = 0;

    videos.forEach((video, index) => {
      if (video.url.includes('example.com') || video.url.includes('localhost')) {
        invalidCount++;
        console.log(`❌ Video ${index + 1}: "${video.title}" - INVALID: ${video.url}`);
      } else {
        validCount++;
        console.log(`✅ Video ${index + 1}: "${video.title}" - ${video.url}`);
      }
    });

    // Get total count
    const totalVideos = await prisma.video.count();
    console.log(`\n📊 Summary (sample of ${videos.length} videos):`);
    console.log(`  - Valid: ${validCount}`);
    console.log(`  - Invalid: ${invalidCount}`);
    console.log(`  - Total videos in database: ${totalVideos}`);

  } catch (error) {
    console.error('❌ Error checking videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVideos();
