import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllVideos() {
  console.log('🔍 Checking ALL video URLs in database...');

  try {
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        url: true,
        sessionId: true
      },
    });

    console.log(`✅ Checking ${videos.length} videos\n`);

    let validCount = 0;
    let invalidCount = 0;
    let suspiciousCount = 0;
    const invalidVideos: any[] = [];
    const suspiciousVideos: any[] = [];

    videos.forEach((video) => {
      // Check for obviously invalid URLs
      if (video.url.includes('example.com') || video.url.includes('localhost') || !video.url || video.url.trim() === '') {
        invalidCount++;
        invalidVideos.push(video);
        console.log(`❌ INVALID: "${video.title}" - ${video.url} (Session: ${video.sessionId})`);
      } 
      // Check for suspicious patterns
      else if (!video.url.includes('youtube.com') && !video.url.includes('youtu.be')) {
        suspiciousCount++;
        suspiciousVideos.push(video);
        console.log(`⚠️  SUSPICIOUS: "${video.title}" - ${video.url} (Session: ${video.sessionId})`);
      } else {
        validCount++;
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`  - Valid YouTube URLs: ${validCount}`);
    console.log(`  - Invalid URLs: ${invalidCount}`);
    console.log(`  - Suspicious non-YouTube URLs: ${suspiciousCount}`);
    console.log(`  - Total videos: ${videos.length}`);

    if (invalidVideos.length > 0) {
      console.log(`\n❌ Invalid videos to fix (${invalidVideos.length}):`);
      invalidVideos.forEach((v, i) => {
        console.log(`  ${i + 1}. ID: ${v.id} - "${v.title}" - ${v.url}`);
      });
    }

    if (suspiciousVideos.length > 0) {
      console.log(`\n⚠️  Suspicious videos to check (${suspiciousVideos.length}):`);
      suspiciousVideos.slice(0, 20).forEach((v, i) => {
        console.log(`  ${i + 1}. ID: ${v.id} - "${v.title}" - ${v.url}`);
      });
      if (suspiciousVideos.length > 20) {
        console.log(`  ... and ${suspiciousVideos.length - 20} more`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllVideos();
