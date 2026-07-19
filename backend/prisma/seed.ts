import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Créer les rôles s'ils n'existent pas
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const learnerRole = await prisma.role.upsert({
    where: { name: 'LEARNER' },
    update: {},
    create: {
      name: 'LEARNER',
    },
  });

  console.log('Roles created:', { adminRole, learnerRole });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
