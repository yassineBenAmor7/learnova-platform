import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function addSpecificCourses() {
  console.log('🔄 Adding specific courses...');

  try {
    // 1. Add 3 courses without sessions
    console.log('1️⃣ Adding 3 courses without sessions...');
    const coursesWithoutSessions = [
      {
        title: 'Blockchain Development & Smart Contracts',
        description: 'Advanced blockchain programming course without sessions (for testing)',
        level: CourseLevel.ADVANCED,
        domain: 'IT_DATA',
        isPaid: true,
        price: 149.99,
        thumbnail: 'https://example.com/blockchain-thumbnail.jpg',
        creatorId: 1
      },
      {
        title: 'Quantum Computing Fundamentals',
        description: 'Introduction to quantum computing concepts without sessions (for testing)',
        level: CourseLevel.ADVANCED,
        domain: 'ACADEMIC_SCIENCES',
        isPaid: true,
        price: 199.99,
        thumbnail: 'https://example.com/quantum-thumbnail.jpg',
        creatorId: 1
      },
      {
        title: 'Cybersecurity & Ethical Hacking',
        description: 'Comprehensive cybersecurity course without sessions (for testing)',
        level: CourseLevel.INTERMEDIATE,
        domain: 'IT_DATA',
        isPaid: true,
        price: 129.99,
        thumbnail: 'https://example.com/cybersec-thumbnail.jpg',
        creatorId: 1
      }
    ];

    for (const courseData of coursesWithoutSessions) {
      const course = await prisma.course.create({
        data: courseData
      });
      console.log(`✅ Created course without sessions: ${course.title}`);
    }

    // 2. Add 1 course with 1 session
    console.log('\n2️⃣ Adding 1 course with 1 session...');
    const courseWithOneSession = await prisma.course.create({
      data: {
        title: 'Introduction to Digital Marketing',
        description: 'A comprehensive course on digital marketing fundamentals',
        level: CourseLevel.BEGINNER,
        domain: 'MARKETING',
        isPaid: false,
        price: 0,
        thumbnail: 'https://example.com/digital-marketing-thumbnail.jpg',
        creatorId: 1
      }
    });
    console.log(`✅ Created course with 1 session: ${courseWithOneSession.title}`);

    const session1 = await prisma.session.create({
      data: {
        title: 'Session 1: Digital Marketing Fundamentals',
        description: 'Introduction to the basics of digital marketing',
        orderNumber: 1,
        courseId: courseWithOneSession.id,
        content: 'This session covers the fundamental concepts of digital marketing including SEO, social media marketing, and email marketing.'
      }
    });
    console.log(`✅ Created session: ${session1.title}`);

    // Add 4 videos to the session
    for (let v = 1; v <= 4; v++) {
      await prisma.video.create({
        data: {
          title: `Chapter ${v}: ${session1.title}`,
          url: `https://www.youtube.com/watch?v=example${courseWithOneSession.id}_${session1.id}_${v}`,
          duration: 600,
          orderNumber: v,
          sessionId: session1.id,
          content: `This chapter covers essential concepts for ${session1.title}.`,
          description: `Comprehensive guide to chapter ${v} of ${session1.title}`
        }
      });
    }
    console.log(`✅ Added 4 videos to session`);

    // 3. Add 2 courses with 2 sessions each
    console.log('\n3️⃣ Adding 2 courses with 2 sessions each...');
    const coursesWithTwoSessions = [
      {
        title: 'Project Management Professional (PMP) Preparation',
        description: 'Complete PMP certification preparation course',
        level: CourseLevel.INTERMEDIATE,
        domain: 'MANAGEMENT',
        isPaid: true,
        price: 199.99,
        thumbnail: 'https://example.com/pmp-thumbnail.jpg'
      },
      {
        title: 'Web Development Full Stack',
        description: 'Complete web development from frontend to backend',
        level: CourseLevel.INTERMEDIATE,
        domain: 'IT_DATA',
        isPaid: true,
        price: 249.99,
        thumbnail: 'https://example.com/fullstack-thumbnail.jpg'
      }
    ];

    for (const courseData of coursesWithTwoSessions) {
      const course = await prisma.course.create({
        data: {
          ...courseData,
          creatorId: 1
        }
      });
      console.log(`✅ Created course with 2 sessions: ${course.title}`);

      for (let s = 1; s <= 2; s++) {
        const session = await prisma.session.create({
          data: {
            title: `Session ${s}: ${course.title} - Part ${s}`,
            description: `Part ${s} of the comprehensive ${course.title} course`,
            orderNumber: s,
            courseId: course.id,
            content: `This session covers advanced topics in ${course.title}. Learn practical skills and real-world applications.`
          }
        });
        console.log(`✅ Created session ${s}: ${session.title}`);

        // Add 4 videos to each session
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
        console.log(`✅ Added 4 videos to session ${s}`);
      }
    }

    console.log('\n🎉 Specific courses added successfully!');
  } catch (error) {
    console.error('❌ Error adding courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSpecificCourses();
