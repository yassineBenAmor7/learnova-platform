import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

let clientInstance: PrismaClient | null = null;
let poolInstance: Pool | null = null;

export function getPrismaClient(): PrismaClient {
  if (!clientInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(poolInstance);
    clientInstance = new PrismaClient({ adapter });
  }
  return clientInstance;
}

export async function closePrismaClient(): Promise<void> {
  if (clientInstance) {
    await clientInstance.$disconnect();
    clientInstance = null;
  }
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
  }
}
