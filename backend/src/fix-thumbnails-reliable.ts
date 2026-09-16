import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnailsReliable() {
  console.log('🔄 Fixing thumbnails with highly reliable image sources...');

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

    // Use via.placeholder.com - very reliable placeholder service
    const reliableImages = [
      'https://via.placeholder.com/800x450/4A90E2/FFFFFF?text=Social+Media+Marketing',
      'https://via.placeholder.com/800x450/F5A623/FFFFFF?text=Copywriting',
      'https://via.placeholder.com/800x450/9013FE/FFFFFF?text=Figma+Design',
      'https://via.placeholder.com/800x450/4D96FF/FFFFFF?text=Music+Production',
      'https://via.placeholder.com/800x450/FF6B6B/FFFFFF?text=Nutrition+Health',
      'https://via.placeholder.com/800x450/FF9F43/FFFFFF?text=Photography',
      'https://via.placeholder.com/800x450/50E3C2/FFFFFF?text=Mental+Health'
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

      const newThumbnail = reliableImages[i];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${courseTitle}"`);
      console.log(`   New: ${newThumbnail}`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with reliable placeholder images!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnailsReliable();
