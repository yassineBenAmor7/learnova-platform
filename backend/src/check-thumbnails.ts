import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkThumbnails() {
  console.log('🔍 Checking course thumbnails...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    let withThumbnail = 0;
    let withoutThumbnail = 0;
    let withInvalidThumbnail = 0;

    courses.forEach((course, index) => {
      if (!course.thumbnail) {
        withoutThumbnail++;
        console.log(`❌ Course ${index + 1}: "${course.title}" - NO THUMBNAIL`);
      } else if (course.thumbnail.includes('example.com') || course.thumbnail.includes('localhost')) {
        withInvalidThumbnail++;
        console.log(`⚠️  Course ${index + 1}: "${course.title}" - INVALID THUMBNAIL: ${course.thumbnail}`);
      } else {
        withThumbnail++;
        console.log(`✅ Course ${index + 1}: "${course.title}" - ${course.thumbnail}`);
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`  - With valid thumbnails: ${withThumbnail}`);
    console.log(`  - Without thumbnails: ${withoutThumbnail}`);
    console.log(`  - With invalid thumbnails: ${withInvalidThumbnail}`);

  } catch (error) {
    console.error('❌ Error checking thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkThumbnails();
