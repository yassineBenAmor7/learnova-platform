import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyThumbnails() {
  console.log('🔍 Verifying thumbnails in database...');

  try {
    const problematicCourses = [
      'Social Media Marketing & Brand Building',
      'Copywriting & Persuasive Writing',
      'Figma Essentials for UI Designers',
      'Music Production Masterclass: Ableton Live & Sound Design',
      'Nutrition, Health & Lifestyle Medicine Foundations',
      'Introduction to Photography & Lighting',
      'Mental Health First Aid & Resilience'
    ];

    for (const courseTitle of problematicCourses) {
      const course = await prisma.course.findFirst({
        where: { title: courseTitle },
        select: {
          id: true,
          title: true,
          thumbnail: true
        }
      });

      if (course) {
        console.log(`\n✅ Course: "${course.title}"`);
        console.log(`   ID: ${course.id}`);
        console.log(`   Thumbnail: ${course.thumbnail}`);
        console.log(`   Thumbnail length: ${course.thumbnail?.length || 0} chars`);
        console.log(`   Starts with: ${course.thumbnail?.substring(0, 50)}...`);
      } else {
        console.log(`\n❌ Course not found: "${courseTitle}"`);
      }
    }

  } catch (error) {
    console.error('❌ Error verifying thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyThumbnails();
