import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function updateSingleSessionTitles() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔄 Checking courses and sessions in database...');

  const courses = await prisma.course.findMany({
    include: {
      sessions: true,
    },
  });

  let updatedCount = 0;

  for (const course of courses) {
    if (course.sessions.length === 1) {
      const session = course.sessions[0];
      if (/^Session\s*1\s*[:\-]\s*/i.test(session.title)) {
        const newTitle = session.title.replace(/^Session\s*1\s*[:\-]\s*/i, 'Session: ');
        await prisma.session.update({
          where: { id: session.id },
          data: { title: newTitle },
        });
        console.log(`[Course ${course.id}] "${session.title}" -> "${newTitle}"`);
        updatedCount++;
      }
    }
  }

  console.log(`\n✅ Successfully updated ${updatedCount} sessions to use "Session: ..." for single-session courses.`);

  await prisma.$disconnect();
  await pool.end();
}

updateSingleSessionTitles().catch(console.error);
