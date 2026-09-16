import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkThumbnailUrls() {
  console.log('🔍 Checking all thumbnail URLs for potential issues...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    const potentialIssues: { course: typeof courses[0]; issue: string }[] = [];

    courses.forEach((course, index) => {
      if (!course.thumbnail) {
        potentialIssues.push({ course, issue: 'NO_THUMBNAIL' });
      } else if (course.thumbnail.includes('example.com') || course.thumbnail.includes('localhost')) {
        potentialIssues.push({ course, issue: 'INVALID_DOMAIN' });
      } else if (!course.thumbnail.startsWith('http://') && !course.thumbnail.startsWith('https://')) {
        potentialIssues.push({ course, issue: 'INVALID_PROTOCOL' });
      } else if (course.thumbnail.length > 500) {
        potentialIssues.push({ course, issue: 'URL_TOO_LONG' });
      }
    });

    if (potentialIssues.length === 0) {
      console.log('✅ All thumbnail URLs appear to be valid!');
      
      // Show sample of current thumbnails
      console.log('\n📋 Sample of current thumbnails:');
      courses.slice(0, 10).forEach((course, index) => {
        console.log(`  ${index + 1}. "${course.title}"`);
        console.log(`     ${course.thumbnail}`);
      });
    } else {
      console.log(`⚠️  Found ${potentialIssues.length} potential issues:\n`);
      
      potentialIssues.forEach(({ course, issue }) => {
        console.log(`❌ Course: "${course.title}"`);
        console.log(`   Issue: ${issue}`);
        console.log(`   URL: ${course.thumbnail || 'null'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error checking thumbnail URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkThumbnailUrls();
