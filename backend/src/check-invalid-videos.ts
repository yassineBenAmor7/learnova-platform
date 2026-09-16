import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInvalidVideos() {
  console.log('🔍 Checking for invalid video URLs...');

  const videos = await prisma.video.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      sessionId: true
    }
  });

  const invalidVideos = videos.filter(video => {
    if (!video.url) return true;
    
    // Check for example/test URLs
    if (video.url.includes('example') || video.url.includes('test')) return true;
    
    // Check for invalid YouTube IDs
    const ytMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      // Valid YouTube IDs are typically 11 characters
      if (videoId.length < 10 || videoId.length > 12) return true;
    }
    
    return false;
  });

  console.log(`\n📊 Total videos: ${videos.length}`);
  console.log(`❌ Invalid videos: ${invalidVideos.length}`);
  
  if (invalidVideos.length > 0) {
    console.log('\n📋 Invalid video list:');
    invalidVideos.forEach((video, index) => {
      console.log(`${index + 1}. ID: ${video.id}`);
      console.log(`   Title: ${video.title}`);
      console.log(`   URL: ${video.url}`);
      console.log(`   Session ID: ${video.sessionId}`);
      console.log('');
    });
  }

  await prisma.$disconnect();
}

checkInvalidVideos();
