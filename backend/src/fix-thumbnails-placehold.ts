import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnailsWithPlacehold() {
  console.log('🔄 Fixing thumbnails with placehold.co (reliable placeholder service)...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        domain: true
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    // Define colors by domain for placehold.co
    const domainColors: { [key: string]: string } = {
      'IT_DATA': '4A90E2',
      'MARKETING': 'F5A623',
      'FINANCE_BUSINESS': '7ED321',
      'MANAGEMENT': 'BD10E0',
      'DESIGN_CREATIVE': '9013FE',
      'LANGUAGE_COMMUNICATION': '50E3C2',
      'HEALTH_WELLNESS': 'FF6B6B',
      'PERSONAL_DEVELOPMENT': 'FFD93D',
      'ACADEMIC_SCIENCES': '6BCB77',
      'MUSIC_ARTS': '4D96FF',
      'LIFESTYLE_HOBBIES': 'FF9F43',
      'SALES_E_COMMERCE': 'EE5A24',
      'HUMANITIES_SOCIAL': '00D2D3',
      'LAW_LEGAL': '2C3E50'
    };

    let updatedCount = 0;

    for (const course of courses) {
      const color = domainColors[course.domain] || '4A90E2';
      const shortTitle = course.title.substring(0, 30);
      
      // Create a reliable placehold.co URL
      const newThumbnail = `https://placehold.co/800x450/${color}/FFFFFF?text=${encodeURIComponent(shortTitle)}`;

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${course.title}"`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with placehold.co!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnailsWithPlacehold();
