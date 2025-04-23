/* eslint-disable no-console */
import type { ArticleStatus } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

import { seedAdmin } from './seeds/admin';
import { seedEditorial } from './seeds/editorial';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Seed initial SYSADMIN user
  await seedAdmin();

  // Create admin user for testing
  let admin = await prisma.user.findFirst({
    where: { username: 'admin' },
  });

  if (!admin) {
    const adminPassword = await bcrypt.hash('admin', 10);
    admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@nx-gaming.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('Created admin user');
  } else {
    console.log('Admin user already exists');
  }

  // Seed editorial team
  await seedEditorial();

  console.log('Created admin users');

  // Create categories
  await prisma.category.upsert({
    where: { name: 'Actualités' },
    update: {},
    create: { name: 'Actualités' },
  });

  const reviewCategory = await prisma.category.upsert({
    where: { name: 'Tests' },
    update: {},
    create: { name: 'Tests' },
  });

  const previewCategory = await prisma.category.upsert({
    where: { name: 'Previews' },
    update: {},
    create: { name: 'Previews' },
  });

  console.log('Created categories');

  // Create platforms
  const switch_ = await prisma.platform.upsert({
    where: { name: 'Nintendo Switch' },
    update: {},
    create: {
      name: 'Nintendo Switch',
      manufacturer: 'Nintendo',
      releaseDate: dayjs('2017-03-03').toDate(),
    },
  });

  const ps5 = await prisma.platform.upsert({
    where: { name: 'PlayStation 5' },
    update: {},
    create: {
      name: 'PlayStation 5',
      manufacturer: 'Sony',
      releaseDate: dayjs('2020-11-12').toDate(),
    },
  });

  const pc = await prisma.platform.upsert({
    where: { name: 'PC' },
    update: {},
    create: {
      name: 'PC',
      manufacturer: 'Multiple',
      releaseDate: null,
    },
  });

  console.log('Created platforms');

  // Create companies
  const nintendo = await prisma.company.upsert({
    where: { name: 'Nintendo' },
    update: {},
    create: {
      name: 'Nintendo',
      isDeveloper: true,
      isPublisher: true,
    },
  });

  const insomniac = await prisma.company.upsert({
    where: { name: 'Insomniac Games' },
    update: {},
    create: {
      name: 'Insomniac Games',
      isDeveloper: true,
      isPublisher: false,
    },
  });

  const sony = await prisma.company.upsert({
    where: { name: 'Sony Interactive Entertainment' },
    update: {},
    create: {
      name: 'Sony Interactive Entertainment',
      isDeveloper: false,
      isPublisher: true,
    },
  });

  const larianStudios = await prisma.company.upsert({
    where: { name: 'Larian Studios' },
    update: {},
    create: {
      name: 'Larian Studios',
      isDeveloper: true,
      isPublisher: true,
    },
  });

  console.log('Created companies');

  // Create games
  const zeldaData = {
    title: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Suite de Breath of the Wild',
    releaseDate: '2023-05-12',
    coverImage: '/images/placeholder-game.png',
    platformIds: [switch_.id],
    developerId: nintendo.id,
    publisherId: nintendo.id,
  };

  const spiderManData = {
    title: "Marvel's Spider-Man 2",
    description: 'Nouvelle aventure de Spider-Man',
    releaseDate: '2023-10-20',
    coverImage: '/images/placeholder-game.png',
    platformIds: [ps5.id],
    developerId: insomniac.id,
    publisherId: sony.id,
  };

  const baldursGateData = {
    title: "Baldur's Gate 3",
    description: "RPG dans l'univers de D&D",
    releaseDate: '2023-08-03',
    coverImage: '/images/placeholder-game.png',
    platformIds: [pc.id, ps5.id],
    developerId: larianStudios.id,
    publisherId: larianStudios.id,
  };

  const zelda = await prisma.game.upsert({
    where: { title: zeldaData.title },
    update: {
      description: zeldaData.description,
      coverImage: zeldaData.coverImage,
      releaseDate: dayjs(zeldaData.releaseDate).toDate(),
      developer: { connect: { id: zeldaData.developerId } },
      publisher: { connect: { id: zeldaData.publisherId } },
      platforms: { set: zeldaData.platformIds.map(id => ({ id })) },
    },
    create: {
      title: zeldaData.title,
      description: zeldaData.description,
      coverImage: zeldaData.coverImage,
      releaseDate: dayjs(zeldaData.releaseDate).toDate(),
      developer: { connect: { id: zeldaData.developerId } },
      publisher: { connect: { id: zeldaData.publisherId } },
      platforms: { connect: zeldaData.platformIds.map(id => ({ id })) },
    },
  });

  const spiderMan2 = await prisma.game.upsert({
    where: { title: spiderManData.title },
    update: {
      description: spiderManData.description,
      coverImage: spiderManData.coverImage,
      releaseDate: dayjs(spiderManData.releaseDate).toDate(),
      developer: { connect: { id: spiderManData.developerId } },
      publisher: { connect: { id: spiderManData.publisherId } },
      platforms: { set: spiderManData.platformIds.map(id => ({ id })) },
    },
    create: {
      title: spiderManData.title,
      description: spiderManData.description,
      coverImage: spiderManData.coverImage,
      releaseDate: dayjs(spiderManData.releaseDate).toDate(),
      developer: { connect: { id: spiderManData.developerId } },
      publisher: { connect: { id: spiderManData.publisherId } },
      platforms: { connect: spiderManData.platformIds.map(id => ({ id })) },
    },
  });

  const baldursGate = await prisma.game.upsert({
    where: { title: baldursGateData.title },
    update: {
      description: baldursGateData.description,
      coverImage: baldursGateData.coverImage,
      releaseDate: dayjs(baldursGateData.releaseDate).toDate(),
      developer: { connect: { id: baldursGateData.developerId } },
      publisher: { connect: { id: baldursGateData.publisherId } },
      platforms: { set: baldursGateData.platformIds.map(id => ({ id })) },
    },
    create: {
      title: baldursGateData.title,
      description: baldursGateData.description,
      coverImage: baldursGateData.coverImage,
      releaseDate: dayjs(baldursGateData.releaseDate).toDate(),
      developer: { connect: { id: baldursGateData.developerId } },
      publisher: { connect: { id: baldursGateData.publisherId } },
      platforms: { connect: baldursGateData.platformIds.map(id => ({ id })) },
    },
  });

  console.log('Created games');

  // Create articles
  const articlesData: Array<{
    title: string;
    content: string;
    categoryId: string;
    gameIds: string[];
    status: ArticleStatus;
    publishedAt: string | null;
  }> = [
    {
      title: 'Le retour triomphal de Link',
      content: 'Une analyse approfondie du nouveau Zelda...',
      categoryId: reviewCategory.id,
      gameIds: [zelda.id],
      status: 'PUBLISHED' as ArticleStatus,
      publishedAt: '2023-05-20',
    },
    {
      title: 'Spider-Man 2 : Notre preview',
      content: 'Nos premières impressions...',
      categoryId: previewCategory.id,
      gameIds: [spiderMan2.id],
      status: 'PENDING_APPROVAL' as ArticleStatus,
      publishedAt: null,
    },
    {
      title: "Baldur's Gate 3 : Le test complet",
      content: "Le RPG de l'année ?",
      categoryId: reviewCategory.id,
      gameIds: [baldursGate.id],
      status: 'DRAFT' as ArticleStatus,
      publishedAt: null,
    },
    {
      title: "L'avenir de Baldur's Gate",
      content: "Les plans pour l'avenir...",
      categoryId: reviewCategory.id,
      gameIds: [baldursGate.id],
      status: 'NEEDS_CHANGES' as ArticleStatus,
      publishedAt: null,
    },
  ];

  for (const articleData of articlesData) {
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        status: articleData.status,
        publishedAt: articleData.publishedAt
          ? dayjs(articleData.publishedAt).toDate()
          : null,
        userId: admin.id,
        categoryId: articleData.categoryId,
        games: {
          connect: articleData.gameIds?.map(id => ({ id })) || [],
        },
      },
    });

    // Create approval history records based on status
    if (articleData.status === 'PENDING_APPROVAL') {
      await prisma.articleApprovalHistory.create({
        data: {
          articleId: article.id,
          fromStatus: 'DRAFT',
          toStatus: 'PENDING_APPROVAL',
          action: 'SUBMITTED',
          actionById: admin.id,
          comment: 'Article soumis pour approbation',
        },
      });
    } else if (articleData.status === 'NEEDS_CHANGES') {
      await prisma.articleApprovalHistory.createMany({
        data: [
          {
            articleId: article.id,
            fromStatus: 'DRAFT',
            toStatus: 'PENDING_APPROVAL',
            action: 'SUBMITTED',
            actionById: admin.id,
            comment: 'Article soumis pour approbation',
          },
          {
            articleId: article.id,
            fromStatus: 'PENDING_APPROVAL',
            toStatus: 'NEEDS_CHANGES',
            action: 'CHANGES_NEEDED',
            actionById: admin.id,
            comment: 'Des modifications sont nécessaires',
          },
        ],
      });
    } else if (articleData.status === 'PUBLISHED') {
      await prisma.articleApprovalHistory.createMany({
        data: [
          {
            articleId: article.id,
            fromStatus: 'DRAFT',
            toStatus: 'PENDING_APPROVAL',
            action: 'SUBMITTED',
            actionById: admin.id,
            comment: 'Article soumis pour approbation',
          },
          {
            articleId: article.id,
            fromStatus: 'PENDING_APPROVAL',
            toStatus: 'PUBLISHED',
            action: 'APPROVED',
            actionById: admin.id,
            comment: 'Article approuvé et publié',
          },
        ],
      });
    }
  }

  console.log('Created articles');
  console.log('Seeding finished');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
