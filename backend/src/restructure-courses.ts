import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function restructureCourses() {
  console.log('🔄 Restructuring courses...');

  try {
    const courses = await prisma.course.findMany({
      include: {
        sessions: true
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    // 1. Create a course without sessions
    console.log('1️⃣ Creating a course without sessions...');
    const courseWithoutSessions = await prisma.course.create({
      data: {
        title: 'Advanced Machine Learning & Deep Learning',
        description: 'A comprehensive course on advanced ML concepts without any sessions (for testing purposes)',
        level: 'ADVANCED',
        domain: 'IT_DATA',
        isPaid: true,
        thumbnail: 'https://example.com/ml-thumbnail.jpg',
        creatorId: 1
      }
    });
    console.log(`✅ Created course without sessions: ${courseWithoutSessions.title}\n`);

    // 2. Keep only one course with 1 session (Agile course)
    console.log('2️⃣ Keeping Agile course with 1 session...');
    const agileCourse = await prisma.course.findFirst({
      where: { title: { contains: 'Agile' } }
    });
    
    if (agileCourse) {
      // Delete extra sessions from Agile course (keep only 1)
      const agileSessions = await prisma.session.findMany({
        where: { courseId: agileCourse.id },
        orderBy: { orderNumber: 'asc' }
      });
      
      if (agileSessions.length > 1) {
        const sessionsToDelete = agileSessions.slice(1);
        await prisma.session.deleteMany({
          where: { id: { in: sessionsToDelete.map(s => s.id) } }
        });
        console.log(`✅ Kept 1 session for Agile course, deleted ${sessionsToDelete.length} extra sessions\n`);
      } else {
        console.log(`✅ Agile course already has 1 session\n`);
      }
    }

    // 3. Add sessions to other courses (at least 7 sessions each)
    console.log('3️⃣ Adding sessions to other courses (at least 7 each)...');
    
    for (const course of courses) {
      // Skip Agile course and the new course without sessions
      if (course.title.includes('Agile') || course.id === courseWithoutSessions.id) {
        continue;
      }

      const currentSessionCount = course.sessions.length;
      
      if (currentSessionCount >= 7) {
        console.log(`  Course "${course.title}" already has ${currentSessionCount} sessions, skipping`);
        continue;
      }

      console.log(`  Course "${course.title}" has ${currentSessionCount} sessions, adding more...`);

      const sessionsToAdd = 7 - currentSessionCount;
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
        
        console.log(`    Created session ${orderNumber} with 4 videos`);
      }
    }

    console.log('\n🎉 Course restructuring completed!');
  } catch (error) {
    console.error('❌ Error restructuring courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restructureCourses();
