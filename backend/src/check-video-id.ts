import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVideoId() {
  const videoId = 'Mi1QBxVjZAo';
  
  const videos = await prisma.video.findMany({
    where: { url: { contains: videoId } },
    include: { session: { include: { course: true } } }
  });

  console.log(`Found ${videos.length} videos with ID ${videoId}:`);
  videos.forEach(v => {
    console.log(`  - Video ID: ${v.id}`);
    console.log(`    URL: ${v.url}`);
    console.log(`    Session: ${v.session?.title}`);
    console.log(`    Course: ${v.session?.course?.title}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkVideoId().catch(console.error);
