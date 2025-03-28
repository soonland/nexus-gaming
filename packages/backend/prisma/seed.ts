import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create initial platforms
  const platforms = [
    {
      name: 'PlayStation 5',
      manufacturer: 'Sony',
      releaseDate: new Date('2020-11-12')
    },
    {
      name: 'Xbox Series X',
      manufacturer: 'Microsoft',
      releaseDate: new Date('2020-11-10')
    },
    {
      name: 'Nintendo Switch',
      manufacturer: 'Nintendo',
      releaseDate: new Date('2017-03-03')
    },
    {
      name: 'PC',
      manufacturer: 'Various',
      releaseDate: null
    }
  ]

  console.log('Seeding platforms...')
  for (const platform of platforms) {
    await prisma.platform.create({
      data: platform
    })
  }
  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
