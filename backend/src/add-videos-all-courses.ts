import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addVideosToAllCourses() {
  console.log('🔄 Adding videos to all courses...');

  try {
    const courses = await prisma.course.findMany({
      include: {
        sessions: {
          include: {
            videos: true
          }
        }
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    let totalVideosAdded = 0;

    for (const course of courses) {
      console.log(`Processing course: ${course.title}`);
      
      for (const session of course.sessions) {
        const currentVideoCount = session.videos.length;
        
        if (currentVideoCount >= 4) {
          console.log(`  Session "${session.title}" already has ${currentVideoCount} videos, skipping`);
          continue;
        }

        console.log(`  Session "${session.title}" has ${currentVideoCount} videos, adding more...`);

        const additionalVideos: string[] = [];
        const startOrder = currentVideoCount + 1;

        // Generate chapter titles based on course title
        const courseKeywords = course.title.split(' ').slice(0, 3).join(' ');
        
        const chapterTemplates = [
          { title: `Chapter ${startOrder}: Introduction to ${courseKeywords}`, duration: 480 },
          { title: `Chapter ${startOrder + 1}: Core Concepts of ${courseKeywords}`, duration: 600 },
          { title: `Chapter ${startOrder + 2}: Advanced Techniques in ${courseKeywords}`, duration: 720 },
          { title: `Chapter ${startOrder + 3}: Practical Applications of ${courseKeywords}`, duration: 540 }
        ];

        for (let i = 0; i < chapterTemplates.length; i++) {
          const template = chapterTemplates[i];
          const orderNumber = startOrder + i;
          
          // Skip if we already have enough videos
          if (orderNumber > 4) break;

          const video = {
            title: template.title,
            url: `https://www.youtube.com/watch?v=example${course.id}_${session.id}_${orderNumber}`,
            duration: template.duration,
            orderNumber: orderNumber,
            sessionId: session.id,
            content: `This ${template.title.toLowerCase()} covers essential concepts and practical applications. Learn the fundamental principles and how to apply them in real-world scenarios.`,
            description: `Comprehensive guide to ${template.title.toLowerCase()}`
          };

          const created = await prisma.video.create({
            data: video
          });
          
          additionalVideos.push(created.title);
          totalVideosAdded++;
        }

        console.log(`    Added ${additionalVideos.length} videos:`);
        additionalVideos.forEach(title => console.log(`      - ${title}`));
      }
      
      console.log('');
    }

    console.log(`🎉 Total videos added: ${totalVideosAdded}`);
  } catch (error) {
    console.error('❌ Error adding videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVideosToAllCourses();
