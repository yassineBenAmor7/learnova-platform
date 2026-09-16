import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeSessions() {
  console.log('🔍 Analyzing session titles...\n');

  try {
    const sessions = await prisma.session.findMany({
      take: 50,
      include: {
        course: {
          select: {
            title: true,
            domain: true
          }
        }
      }
    });

    sessions.forEach((session, index) => {
      console.log(`${index + 1}. Course: ${session.course.title} (${session.course.domain})`);
      console.log(`   Session: ${session.title}`);
      console.log(`   Description: ${session.description || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error analyzing sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeSessions();
