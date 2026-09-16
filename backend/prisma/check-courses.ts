import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    include: { sessions: true },
  });

  console.log(`Found ${courses.length} courses:`);
  courses.forEach((course) => {
    console.log(`\nID: ${course.id}`);
    console.log(`Title: ${course.title}`);
    console.log(`Sessions: ${course.sessions.length}`);
    course.sessions.forEach((session) => {
      console.log(`  - ${session.title} (ID: ${session.id})`);
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
