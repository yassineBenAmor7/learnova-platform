import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findDuplicateCourses() {
  console.log('🔍 Finding duplicate courses...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    // Group courses by title
    const courseMap: { [key: string]: typeof courses } = {};

    courses.forEach(course => {
      if (!courseMap[course.title]) {
        courseMap[course.title] = [];
      }
      courseMap[course.title].push(course);
    });

    // Find duplicates
    const duplicates: { title: string; count: number; courses: typeof courses }[] = [];

    Object.keys(courseMap).forEach(title => {
      if (courseMap[title].length > 1) {
        duplicates.push({
          title,
          count: courseMap[title].length,
          courses: courseMap[title]
        });
      }
    });

    if (duplicates.length === 0) {
      console.log('✅ No duplicate courses found!');
    } else {
      console.log(`⚠️  Found ${duplicates.length} duplicate course titles:\n`);

      duplicates.forEach(({ title, count, courses }) => {
        console.log(`"${title}" - ${count} copies:`);
        courses.forEach(course => {
          console.log(`  - ID: ${course.id}, Created: ${course.createdAt.toISOString()}`);
        });
        console.log('');
      });

      console.log(`📊 Total duplicates to remove: ${duplicates.reduce((sum, d) => sum + d.count - 1, 0)}`);
    }

  } catch (error) {
    console.error('❌ Error finding duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findDuplicateCourses();
