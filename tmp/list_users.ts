import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from 'dotenv'
dotenv.config()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const users = await prisma.user.findMany()
  console.log(JSON.stringify(users, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
