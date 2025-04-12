/* eslint-disable no-console */
import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt'
const prisma = new PrismaClient()

const SALT_ROUNDS = 10

export const seedAdmin = async () => {
  try {
    // Check if SYSADMIN already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.SYSADMIN }
    })

    if (!existingAdmin) {
      // Create initial SYSADMIN user with hashed password
      const hashedPassword = await hash('Adm1nP@ss123!', SALT_ROUNDS)
      await prisma.user.create({
        data: {
          username: 'sysadmin',
          email: 'sysadmin@nexus-gaming.com',
          password: hashedPassword, // This should be changed after first login
          role: Role.SYSADMIN,
          isActive: true
        }
      })
      console.log('✅ Initial SYSADMIN user created')
    } else {
      console.log('ℹ️ SYSADMIN user already exists')
    }
  } catch (error) {
    console.error('Error seeding admin:', error)
    throw error
  }
}
