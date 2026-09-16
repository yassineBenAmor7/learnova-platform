require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

let clientInstance = null;
let poolInstance = null;

function getPrismaClient() {
  if (!clientInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(poolInstance);
    clientInstance = new PrismaClient({ adapter });
  }
  return clientInstance;
}

async function closePrismaClient() {
  if (clientInstance) {
    await clientInstance.$disconnect();
    clientInstance = null;
  }
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
  }
}

module.exports = {
  getPrismaClient,
  closePrismaClient,
  prisma: getPrismaClient(),
};
