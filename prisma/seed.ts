import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { GameForm, ArticleForm } from '@/types'
import dayjs from '@/lib/dayjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin', 10)
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user')

  // Create categories
  const newsCategory = await prisma.category.create({
    data: {
      name: 'Actualités',
    },
  })

  const reviewCategory = await prisma.category.create({
    data: {
      name: 'Tests',
    },
  })

  const previewCategory = await prisma.category.create({
    data: {
      name: 'Previews',
    },
  })

  console.log('Created categories')

  // Create platforms
  const switch_ = await prisma.platform.create({
    data: {
      name: 'Nintendo Switch',
      manufacturer: 'Nintendo',
      releaseDate: dayjs('2017-03-03').toDate(),
    },
  })

  const ps5 = await prisma.platform.create({
    data: {
      name: 'PlayStation 5',
      manufacturer: 'Sony',
      releaseDate: dayjs('2020-11-12').toDate(),
    },
  })

  const pc = await prisma.platform.create({
    data: {
      name: 'PC',
      manufacturer: 'Multiple',
      releaseDate: null,
    },
  })

  console.log('Created platforms')

  // Create companies
  const nintendo = await prisma.company.create({
    data: {
      name: 'Nintendo',
      isDeveloper: true,
      isPublisher: true,
    },
  })

  const insomniac = await prisma.company.create({
    data: {
      name: 'Insomniac Games',
      isDeveloper: true,
      isPublisher: false,
    },
  })

  const sony = await prisma.company.create({
    data: {
      name: 'Sony Interactive Entertainment',
      isDeveloper: false,
      isPublisher: true,
    },
  })

  const larianStudios = await prisma.company.create({
    data: {
      name: 'Larian Studios',
      isDeveloper: true,
      isPublisher: true,
    },
  })

  console.log('Created companies')

  // Create games
  const zeldaData: GameForm = {
    title: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Suite de Breath of the Wild',
    releaseDate: '2023-05-12',
    coverImage: '/images/placeholder-game.png',
    platformIds: [switch_.id],
    developerId: nintendo.id,
    publisherId: nintendo.id,
  }

  const spiderManData: GameForm = {
    title: 'Marvel\'s Spider-Man 2',
    description: 'Nouvelle aventure de Spider-Man',
    releaseDate: '2023-10-20',
    coverImage: '/images/placeholder-game.png',
    platformIds: [ps5.id],
    developerId: insomniac.id,
    publisherId: sony.id,
  }

  const baldursGateData: GameForm = {
    title: 'Baldur\'s Gate 3',
    description: 'RPG dans l\'univers de D&D',
    releaseDate: '2023-08-03',
    coverImage: '/images/placeholder-game.png',
    platformIds: [pc.id, ps5.id],
    developerId: larianStudios.id,
    publisherId: larianStudios.id,
  }

  const zelda = await prisma.game.create({
    data: {
      title: zeldaData.title,
      description: zeldaData.description,
      coverImage: zeldaData.coverImage,
      releaseDate: dayjs(zeldaData.releaseDate!).toDate(),
      developer: { connect: { id: zeldaData.developerId } },
      publisher: { connect: { id: zeldaData.publisherId } },
      platforms: { connect: zeldaData.platformIds.map(id => ({ id })) },
    },
  })

  const spiderMan2 = await prisma.game.create({
    data: {
      title: spiderManData.title,
      description: spiderManData.description,
      coverImage: spiderManData.coverImage,
      releaseDate: dayjs(spiderManData.releaseDate!).toDate(),
      developer: { connect: { id: spiderManData.developerId } },
      publisher: { connect: { id: spiderManData.publisherId } },
      platforms: { connect: spiderManData.platformIds.map(id => ({ id })) },
    },
  })

  const baldursGate = await prisma.game.create({
    data: {
      title: baldursGateData.title,
      description: baldursGateData.description,
      coverImage: baldursGateData.coverImage,
      releaseDate: dayjs(baldursGateData.releaseDate!).toDate(),
      developer: { connect: { id: baldursGateData.developerId } },
      publisher: { connect: { id: baldursGateData.publisherId } },
      platforms: { connect: baldursGateData.platformIds.map(id => ({ id })) },
    },
  })

  console.log('Created games')

  // Create articles
  // Create articles
  const articlesData: ArticleForm[] = [
    {
      title: 'Le retour triomphal de Link',
      content: 'Une analyse approfondie du nouveau Zelda...',
      categoryId: reviewCategory.id,
      gameIds: [zelda.id],
      status: 'PUBLISHED',
      publishedAt: '2023-05-20',
    },
    {
      title: 'Spider-Man 2 : Notre preview',
      content: 'Nos premières impressions...',
      categoryId: previewCategory.id,
      gameIds: [spiderMan2.id],
      status: 'PUBLISHED',
      publishedAt: '2023-09-15',
    },
    {
      title: 'Baldur\'s Gate 3 : Le test complet',
      content: 'Le RPG de l\'année ?',
      categoryId: reviewCategory.id,
      gameIds: [baldursGate.id],
      status: 'PUBLISHED',
      publishedAt: '2023-08-10',
    },
  ]

  for (const articleData of articlesData) {
    await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        status: articleData.status,
        publishedAt: articleData.publishedAt ? dayjs(articleData.publishedAt).toDate() : null,
        userId: admin.id,
        categoryId: articleData.categoryId,
        games: {
          connect: articleData.gameIds?.map(id => ({ id })) || [],
        },
      },
    })
  }

  console.log('Created articles')
  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
