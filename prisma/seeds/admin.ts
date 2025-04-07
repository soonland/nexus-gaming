import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

export const seedAdmin = async () => {
  try {
    // Check if SYSADMIN already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: Role.SYSADMIN }
    })

    if (!existingAdmin) {
      // Create initial SYSADMIN user
      await prisma.user.create({
        data: {
          username: 'sysadmin',
          email: 'sysadmin@nexus-gaming.com',
          password: 'Adm1nP@ss123!', // This should be changed after first login
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
