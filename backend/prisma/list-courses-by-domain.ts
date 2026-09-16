import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    select: { title: true, domain: true },
    orderBy: [{ domain: 'asc' }, { title: 'asc' }],
  });
  const byDomain: Record<string, string[]> = {};
  for (const c of courses) {
    byDomain[c.domain] = byDomain[c.domain] || [];
    byDomain[c.domain].push(c.title);
  }
  for (const domain of Object.keys(byDomain).sort()) {
    console.log(`\n${domain} (${byDomain[domain].length}):`);
    byDomain[domain].forEach((t) => console.log(`  - ${t}`));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
