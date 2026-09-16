import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecificThumbnails() {
  console.log('🔄 Fixing specific thumbnails that are not displaying...');

  try {
    const problematicCourses = [
      'Introduction to Digital Marketing',
      'Nutrition, Health & Lifestyle Medicine Foundations',
      'Sleep Science & Recovery Optimization',
      'Mental Health First Aid & Resilience',
      'Sports Injury Prevention & Rehabilitation',
      'Music Production Masterclass: Ableton Live & Sound Design',
      'Guitar Fundamentals & Chord Progressions',
      'Watercolor Painting Techniques',
      'Theatre Acting & Stage Performance'
    ];

    // Define alternative reliable image sources
    const alternativeImages = [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0',
      'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      'https://images.unsplash.com/photo-1544367563-12123d8d5e80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      'https://images.unsplash.com/photo-1511379938545-c1f69419868d',
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
      'https://images.unsplash.com/photo-1503095396549-807759245b35'
    ];

    let updatedCount = 0;

    for (const courseTitle of problematicCourses) {
      const course = await prisma.course.findFirst({
        where: { title: courseTitle }
      });

      if (!course) {
        console.log(`⚠️  Course not found: "${courseTitle}"`);
        continue;
      }

      const randomIndex = Math.floor(Math.random() * alternativeImages.length);
      const newThumbnail = alternativeImages[randomIndex];

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

fixSpecificThumbnails();
