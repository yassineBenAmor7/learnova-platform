import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnailsPicsum() {
  console.log('🔄 Fixing thumbnails with picsum.photos (highly reliable)...');

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

    // Use picsum.photos - very reliable random image service
    const picsumImages = [
      'https://picsum.photos/800/450?random=1',
      'https://picsum.photos/800/450?random=2',
      'https://picsum.photos/800/450?random=3',
      'https://picsum.photos/800/450?random=4',
      'https://picsum.photos/800/450?random=5',
      'https://picsum.photos/800/450?random=6',
      'https://picsum.photos/800/450?random=7'
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

      const newThumbnail = picsumImages[i];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${courseTitle}"`);
      console.log(`   New: ${newThumbnail}`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with picsum.photos!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnailsPicsum();
