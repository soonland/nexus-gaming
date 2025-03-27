import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.articleGame.deleteMany();
  await prisma.article.deleteMany();
  await prisma.review.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await hash('admin123', 10);
  const userPassword = await hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexus.com',
      password: adminPassword,
      username: 'Admin',
      role: 'ADMIN',
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alex@example.com',
        password: userPassword,
        username: 'AlexGamer',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sophie@example.com',
        password: userPassword,
        username: 'SophieGames',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'marc@example.com',
        password: userPassword,
        username: 'MarcReviewer',
        role: 'USER',
      },
    }),
  ]);

  // Create games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        title: 'The Legend of Zelda: Tears of the Kingdom',
        description: 'Suite très attendue de Breath of the Wild, offrant une nouvelle aventure épique dans le royaume d\'Hyrule avec de nouvelles mécaniques de gameplay innovantes.',
        releaseDate: new Date('2023-05-12'),
        platform: ['Nintendo Switch'],
        publisher: 'Nintendo',
        developer: 'Nintendo EPD',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Cyberpunk 2077',
        description: 'RPG en monde ouvert se déroulant dans Night City, une mégalopole obsédée par le pouvoir, le glamour et les modifications corporelles.',
        releaseDate: new Date('2020-12-10'),
        platform: ['PC', 'PlayStation', 'Xbox'],
        publisher: 'CD Projekt',
        developer: 'CD Projekt RED',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Elden Ring',
        description: 'Action-RPG en monde ouvert développé par FromSoftware en collaboration avec George R. R. Martin.',
        releaseDate: new Date('2022-02-25'),
        platform: ['PC', 'PlayStation', 'Xbox'],
        publisher: 'Bandai Namco',
        developer: 'FromSoftware',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Stardew Valley',
        description: 'Jeu de simulation de vie agricole où vous héritez de l\'ancienne ferme de votre grand-père.',
        releaseDate: new Date('2016-02-26'),
        platform: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
        publisher: 'ConcernedApe',
        developer: 'ConcernedApe',
      },
    }),
    prisma.game.create({
      data: {
        title: 'God of War Ragnarök',
        description: 'Suite de God of War (2018), suivant Kratos et son fils Atreus dans leur voyage à travers les neuf royaumes.',
        releaseDate: new Date('2022-11-09'),
        platform: ['PlayStation'],
        publisher: 'Sony Interactive Entertainment',
        developer: 'Santa Monica Studio',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Hades',
        description: 'Rogue-like d\'action où vous incarnez le prince des Enfers tentant de s\'échapper du royaume des morts.',
        releaseDate: new Date('2020-09-17'),
        platform: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
        publisher: 'Supergiant Games',
        developer: 'Supergiant Games',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Among Us',
        description: 'Jeu multijoueur de déduction sociale se déroulant dans l\'espace.',
        releaseDate: new Date('2018-06-15'),
        platform: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
        publisher: 'InnerSloth',
        developer: 'InnerSloth',
      },
    }),
    prisma.game.create({
      data: {
        title: 'Baldur\'s Gate 3',
        description: 'RPG épique basé sur Dungeons & Dragons, développé par les créateurs de Divinity: Original Sin.',
        releaseDate: new Date('2023-08-03'),
        platform: ['PC', 'PlayStation'],
        publisher: 'Larian Studios',
        developer: 'Larian Studios',
      },
    }),
  ]);

  // Create reviews
  const reviews = [];
  for (const game of games) {
    const gameReviews = await Promise.all([
      prisma.review.create({
        data: {
          rating: 4.5 + Math.random() * 0.5,
          content: `Une expérience de jeu incroyable. ${game.title} repousse les limites du genre et offre des heures de divertissement.`,
          gameId: game.id,
          userId: users[0].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 3.5 + Math.random() * 1.5,
          content: `Bien que ${game.title} ait quelques défauts mineurs, c'est globalement un excellent jeu qui mérite d'être joué.`,
          gameId: game.id,
          userId: users[1].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 4.0 + Math.random() * 1.0,
          content: `${game.title} propose une expérience unique et mémorable. Recommandé pour tous les amateurs du genre.`,
          gameId: game.id,
          userId: users[2].id,
        },
      }),
    ]);
    reviews.push(...gameReviews);
  }

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Les meilleurs RPG de 2023',
        content: 'Une analyse approfondie des RPG les plus marquants de l\'année, de Baldur\'s Gate 3 à Zelda: Tears of the Kingdom. Ces jeux ont redéfini les standards du genre...',
        userId: users[0].id,
        games: {
          create: [
            { gameId: games[0].id },
            { gameId: games[7].id },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'L\'évolution des jeux indépendants',
        content: 'Comment les jeux indépendants comme Stardew Valley et Hades ont révolutionné l\'industrie et prouvé qu\'une petite équipe peut créer des chefs-d\'œuvre...',
        userId: users[1].id,
        games: {
          create: [
            { gameId: games[3].id },
            { gameId: games[5].id },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'Le phénomène du multijoueur social',
        content: 'L\'impact des jeux sociaux comme Among Us sur la communauté gaming et comment ils ont changé notre façon de jouer ensemble...',
        userId: users[2].id,
        games: {
          create: [
            { gameId: games[6].id },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'Les exclusivités PlayStation qui ont marqué 2022',
        content: 'God of War Ragnarök a établi de nouveaux standards pour les exclusivités console. Une analyse détaillée de son impact...',
        userId: users[0].id,
        games: {
          create: [
            { gameId: games[4].id },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: 'Le renouveau des RPG open-world',
        content: 'De Cyberpunk 2077 à Elden Ring, comment les RPG en monde ouvert continuent d\'évoluer et d\'innover...',
        userId: users[1].id,
        games: {
          create: [
            { gameId: games[1].id },
            { gameId: games[2].id },
          ],
        },
      },
    }),
  ]);

  console.log('Base de données ensemencée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
