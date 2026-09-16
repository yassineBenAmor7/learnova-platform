import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProgress() {
  console.log('🔍 Checking Progress for Yassine Ben Amor...');

  try {
    // Find the user
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'benamoryassine519@gmail.com' },
          { firstName: 'Yassine', lastName: 'Ben Amor' }
        ]
      }
    });

    if (!user) {
      console.error('❌ User not found.');
      return;
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);

    // Find enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { 
        progress: true,
        course: true
      }
    });

    console.log(`\n✅ Found ${enrollments.length} enrollments:\n`);

    enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. Course: ${enrollment.course.title}`);
      console.log(`   Progress ID: ${enrollment.progress?.id || 'N/A'}`);
      console.log(`   Percentage: ${enrollment.progress?.percentage || 0}%`);
      console.log(`   Completed Sessions: ${enrollment.progress?.completedSessions || 0}`);
      console.log(`   Learning Time Seconds: ${enrollment.progress?.learningTimeSeconds || 0}`);
      console.log(`   Learning Time Hours: ${Math.floor((enrollment.progress?.learningTimeSeconds || 0) / 3600)}h`);
      console.log('');
    });

    // Calculate total learning time
    const totalLearningTime = enrollments.reduce(
      (acc, e) => acc + (e.progress?.learningTimeSeconds || 0),
      0,
    );

    console.log(`Total Learning Time: ${totalLearningTime} seconds = ${Math.floor(totalLearningTime / 3600)} hours`);

  } catch (error) {
    console.error('❌ Error checking progress:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProgress();
