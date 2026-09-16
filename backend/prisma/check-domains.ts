import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.course.groupBy({
    by: ['domain'],
    _count: { id: true },
  });
  rows.sort((a, b) => a.domain.localeCompare(b.domain));
  for (const row of rows) {
    console.log(`${row.domain}: ${row._count.id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
