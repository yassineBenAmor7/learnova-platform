import { PrismaClient, RoleName } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN },
  });

  const learnerRole = await prisma.role.upsert({
    where: { name: RoleName.LEARNER },
    update: {},
    create: { name: RoleName.LEARNER },
  });

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@learnova.com' },
    update: {},
    create: {
      email: 'admin@learnova.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Learnova',
      roleId: adminRole.id,
    },
  });

  const learnerPassword = await bcrypt.hash('Learner@123', 10);
  await prisma.user.upsert({
    where: { email: 'learner@gmail.com' },
    update: {},
    create: {
      email: 'learner@gmail.com',
      password: learnerPassword,
      firstName: 'Apprenant',
      lastName: 'Demo',
      roleId: learnerRole.id,
    },
  });

  console.log('Seed completed: roles, admin and demo learner created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
