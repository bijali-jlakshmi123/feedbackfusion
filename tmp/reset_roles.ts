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
    // Demote all users to 'user' role
    await prisma.user.updateMany({
        data: {
            role: 'user'
        }
    })

    // Set specifically this email as admin
    const result = await prisma.user.update({
        where: {
            email: 'bijalijayalakshmijayan@gmail.com'
        },
        data: {
            role: 'admin'
        }
    })
    
  console.log(`Updated roles. Admin set for: ${result.email}`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
