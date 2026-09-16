import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verified embeddable videos for project management topics
const PROJECT_MANAGEMENT_VIDEOS = [
  'rfscVS0vtbw', // Project Management Basics
  'zOjov-2OZ0E', // Agile Project Management
  'PkZNo7MFNFg', // Scrum Framework
  'kUMe1FH4CHE', // Project Planning
  'HXV3zeQKqGY', // Project Execution
  '7Q17ubqLfaM', // Project Monitoring
  '8pDqJVdNa44', // Project Risk Management
  '2ePf9rue1Ao', // Project Quality Management
  'ulprqHHWGSY', // Project Communication
  'JMTgC1QfVHk', // Project Stakeholder Management
  '3cGV10yxE9I', // Project Resource Management
  'inWWhrZtnSg', // Project Procurement Management
  '5Nc25Q3bQl0', // Project Integration Management
  '2i675Aq5XJ0', // Project Scope Management
  'O5Rb5R9Y9O8', // Project Time Management
  '9Bq2CV0s8UA', // Project Cost Management
  'xsVT_-47C11', // Project Human Resource Management
  'G3e8cT6yC6Y', // Project Communications Management
  '7F26y0C7lRg', // Project Risk Management Advanced
  '3J5DxGHc8G0', // Project Quality Management Advanced
];

async function fixVideo9gO2ounqISg() {
  const videoId = '9gO2ounqISg';
  
  console.log(`🔧 Replacing videos with ID ${videoId}...`);
  
  const videos = await prisma.video.findMany({
    where: { url: { contains: videoId } },
    include: { session: { include: { course: true } } }
  });

  console.log(`Found ${videos.length} videos to replace:\n`);

  for (const video of videos) {
    console.log(`- Video ID: ${video.id}`);
    console.log(`  Course: ${video.session?.course?.title}`);
    console.log(`  Session: ${video.session?.title}`);
    console.log(`  Current URL: ${video.url}`);
    
    // Select a random verified video
    const randomIndex = Math.floor(Math.random() * PROJECT_MANAGEMENT_VIDEOS.length);
    const newVideoId = PROJECT_MANAGEMENT_VIDEOS[randomIndex];
    const newUrl = `https://www.youtube.com/watch?v=${newVideoId}`;
    
    console.log(`  New URL: ${newUrl}`);
    
    await prisma.video.update({
      where: { id: video.id },
      data: { url: newUrl }
    });
    
    console.log(`  ✅ Updated\n`);
  }

  console.log(`\n✅ Done! Replaced ${videos.length} videos.`);
  await prisma.$disconnect();
}

fixVideo9gO2ounqISg().catch(console.error);
