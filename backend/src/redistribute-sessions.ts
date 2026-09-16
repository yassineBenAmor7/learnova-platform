import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function redistributeSessions() {
  console.log('🔄 Redistributing sessions across courses...');

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

    console.log(`✅ Found ${courses.length} courses\n`);

    // Define target session counts: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
    const targetSessionCounts = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    let targetIndex = 0;

    let modifiedCount = 0;

    for (const course of courses) {
      const currentSessionCount = course.sessions.length;
      
      // Skip courses with 0, 1, or 2 sessions (keep them as is)
      if (currentSessionCount <= 2) {
        console.log(`Course "${course.title}" has ${currentSessionCount} sessions, keeping as is`);
        continue;
      }

      const targetCount = targetSessionCounts[targetIndex % targetSessionCounts.length];
      targetIndex++;

      console.log(`Course "${course.title}" has ${currentSessionCount} sessions, adjusting to ${targetCount}...`);

      if (currentSessionCount > targetCount) {
        // Remove excess sessions
        const sessionsToDelete = course.sessions.slice(targetCount);
        const sessionIdsToDelete = sessionsToDelete.map(s => s.id);
        
        await prisma.session.deleteMany({
          where: { id: { in: sessionIdsToDelete } }
        });
        
        console.log(`  Deleted ${sessionsToDelete.length} sessions`);
        modifiedCount++;
      } else if (currentSessionCount < targetCount) {
        // Add missing sessions
        const sessionsToAdd = targetCount - currentSessionCount;
        const startOrder = currentSessionCount + 1;

        for (let i = 0; i < sessionsToAdd; i++) {
          const orderNumber = startOrder + i;
          
          const session = await prisma.session.create({
            data: {
              title: `Session ${orderNumber}: ${course.title} - Part ${orderNumber}`,
              description: `Part ${orderNumber} of the comprehensive ${course.title} course`,
              orderNumber: orderNumber,
              courseId: course.id,
              content: `This session covers advanced topics in ${course.title}. Learn practical skills and real-world applications.`
            }
          });

          // Add 4 videos to each new session
          for (let v = 1; v <= 4; v++) {
            await prisma.video.create({
              data: {
                title: `Chapter ${v}: ${session.title}`,
                url: `https://www.youtube.com/watch?v=example${course.id}_${session.id}_${v}`,
                duration: 600,
                orderNumber: v,
                sessionId: session.id,
                content: `This chapter covers essential concepts for ${session.title}.`,
                description: `Comprehensive guide to chapter ${v} of ${session.title}`
              }
            });
          }
        }
        
        console.log(`  Added ${sessionsToAdd} sessions with 4 videos each`);
        modifiedCount++;
      }
    }

    console.log(`\n🎉 Session redistribution completed! Modified ${modifiedCount} courses.`);
  } catch (error) {
    console.error('❌ Error redistributing sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

redistributeSessions();
