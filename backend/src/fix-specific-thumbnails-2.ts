import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecificThumbnails2() {
  console.log('🔄 Fixing specific thumbnails with alternative image sources...');

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

    // Use different reliable image sources
    const alternativeImages = [
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a',
      'https://images.unsplash.com/photo-1586717791821-3f44a5638d48',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
      'https://images.unsplash.com/photo-1554048612-387768052bf7',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
    ];

    let updatedCount = 0;

    for (let i = 0; i < problematicCourses.length; i++) {
      const courseTitle = problematicCourses[i];
      const course = await prisma.course.findFirst({
        where: { title: courseTitle }
      });

      if (!course) {
        console.log(`⚠️  Course not found: "${courseTitle}"`);
        continue;
      }

      const newThumbnail = alternativeImages[i % alternativeImages.length];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${courseTitle}"`);
      console.log(`   Old: ${course.thumbnail}`);
      console.log(`   New: ${newThumbnail}`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} specific course thumbnails!`);

  } catch (error) {
    console.error('❌ Error fixing specific thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecificThumbnails2();
