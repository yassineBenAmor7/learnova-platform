import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addLearningTime() {
  console.log('🔄 Adding learning time for completed course...');

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

    // Find enrollment with progress
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id },
      include: { progress: true }
    });

    if (!enrollment || !enrollment.progress) {
      console.error('❌ Enrollment or progress not found.');
      return;
    }

    console.log(`✅ Found enrollment with progress ID: ${enrollment.progress.id}`);
    console.log(`Current learning time: ${enrollment.progress.learningTimeSeconds} seconds`);

    // Add learning time (assuming 2 hours for completing the course)
    const addedTime = 2 * 3600; // 2 hours in seconds
    
    const updatedProgress = await prisma.progress.update({
      where: { id: enrollment.progress.id },
      data: {
        learningTimeSeconds: addedTime
      }
    });

    console.log(`✅ Updated learning time to: ${updatedProgress.learningTimeSeconds} seconds = ${Math.floor(updatedProgress.learningTimeSeconds / 3600)} hours`);

    console.log('🎉 Learning time updated successfully!');
  } catch (error) {
    console.error('❌ Error adding learning time:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addLearningTime();
