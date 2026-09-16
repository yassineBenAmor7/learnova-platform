import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnailsBase64() {
  console.log('🔄 Fixing thumbnails with base64 SVG data URIs (guaranteed to work)...');

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

    // Create base64 SVG data URIs - guaranteed to work
    const createBase64Image = (color: string, text: string) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="${color}"/><text x="400" y="225" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    };

    const base64Images = [
      createBase64Image('#4A90E2', 'Social Media Marketing'),
      createBase64Image('#F5A623', 'Copywriting'),
      createBase64Image('#9013FE', 'Figma Design'),
      createBase64Image('#4D96FF', 'Music Production'),
      createBase64Image('#FF6B6B', 'Nutrition Health'),
      createBase64Image('#FF9F43', 'Photography'),
      createBase64Image('#50E3C2', 'Mental Health')
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

      const newThumbnail = base64Images[i];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${courseTitle}"`);
      console.log(`   New: ${newThumbnail.substring(0, 50)}...`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with base64 SVG data URIs!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnailsBase64();
