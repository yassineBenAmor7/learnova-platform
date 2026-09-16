import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteDuplicateCourses() {
  console.log('🗑️  Deleting duplicate courses...');

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

    // Find duplicates and keep only the first (oldest) copy
    let deletedCount = 0;
    const idsToDelete: number[] = [];

    Object.keys(courseMap).forEach(title => {
      const courseCopies = courseMap[title];
      
      if (courseCopies.length > 1) {
        // Keep the first (oldest) copy, delete the rest
        const toDelete = courseCopies.slice(1);
        
        console.log(`"${title}" - Keeping ID ${courseCopies[0].id}, deleting ${toDelete.length} copies:`);
        
        toDelete.forEach(course => {
          console.log(`  - Deleting ID ${course.id} (created: ${course.createdAt.toISOString()})`);
          idsToDelete.push(course.id);
        });
      }
    });

    // Delete all duplicates at once
    if (idsToDelete.length > 0) {
      const result = await prisma.course.deleteMany({
        where: { id: { in: idsToDelete } }
      });
      deletedCount = result.count;
    }
    
    console.log(`\n🎉 Deleted ${deletedCount} duplicate courses!`);

  } catch (error) {
    console.error('❌ Error deleting duplicates:', error);
    await prisma.$disconnect();
  }
}

deleteDuplicateCourses();
