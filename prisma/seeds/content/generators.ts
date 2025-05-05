import { fakerFR as faker } from '@faker-js/faker';
import type { Platform, GameGenre } from '@prisma/client';
import { ArticleStatus, PrismaClient } from '@prisma/client';

import { gameTemplates, articleTemplates } from './templates';
import type { IReviewTemplate, IPreviewTemplate } from './templates';
import {
  generateGameSlug,
  generateArticleSlug,
  getByIndex,
  getSubsetByIndex,
  replaceTemplateVars,
} from './utils';

const prisma = new PrismaClient();

// Types for generated content
interface IGeneratedGame {
  slug: string;
  title: string;
  description: string;
  genre: GameGenre;
  developerId: string;
  publisherId: string;
  developer: { name: string };
}

function isReviewTemplate(
  template: IReviewTemplate | IPreviewTemplate
): template is IReviewTemplate {
  return 'gameplayTemplates' in template;
}

/**
 * Génère un jeu de manière déterministe
 */
export async function generateGame(
  companies: { id: string; isDeveloper: boolean; isPublisher: boolean }[],
  platforms: Platform[],
  index: number
): Promise<IGeneratedGame> {
  const template = index % 2 === 0 ? gameTemplates.action : gameTemplates.rpg;
  const hero = faker.person.firstName();
  const world = faker.location.country();
  const slug = generateGameSlug(index);

  // Sélection déterministe des éléments
  const title = replaceTemplateVars(getByIndex(template.titles, index), {
    hero,
    world,
  });

  const premise = getByIndex(template.premises, index);
  const mission = getByIndex(template.missions, index);
  const description = replaceTemplateVars(
    getByIndex(template.descriptions, index),
    {
      hero,
      world,
      premise,
      mission,
    }
  );

  // Sélection déterministe des entreprises et plateformes
  const developers = companies.filter(c => c.isDeveloper);
  const publishers = companies.filter(c => c.isPublisher);
  const developer = getByIndex(developers, index);
  const publisher = getByIndex(publishers, index);
  const gamePlatforms = getSubsetByIndex(platforms, index, 3);

  // Vérifie si le jeu existe déjà
  const existingGame = await prisma.game.findUnique({
    where: { slug },
  });

  if (existingGame) {
    // Mise à jour du jeu existant
    return (await prisma.game.update({
      where: { id: existingGame.id },
      data: {
        title,
        description,
        genre: getByIndex(template.genres, index),
        releaseDate: faker.date.future(),
        developer: { connect: { id: developer.id } },
        publisher: { connect: { id: publisher.id } },
        platforms: {
          set: gamePlatforms.map(p => ({ id: p.id })),
        },
        coverImage: null,
      },
      select: {
        slug: true,
        title: true,
        description: true,
        genre: true,
        developerId: true,
        publisherId: true,
        developer: {
          select: { name: true },
        },
      },
    })) as IGeneratedGame;
  }

  // Création d'un nouveau jeu
  return (await prisma.game.create({
    data: {
      slug,
      title,
      description,
      genre: getByIndex(template.genres, index),
      releaseDate: faker.date.future(),
      developer: { connect: { id: developer.id } },
      publisher: { connect: { id: publisher.id } },
      platforms: {
        connect: gamePlatforms.map(p => ({ id: p.id })),
      },
      coverImage: null,
    },
    select: {
      slug: true,
      title: true,
      description: true,
      genre: true,
      developerId: true,
      publisherId: true,
      developer: {
        select: { name: true },
      },
    },
  })) as IGeneratedGame;
}

/**
 * Génère un article de manière déterministe
 */
// Possible previous statuses for deleted articles
const possiblePreviousStatuses = [
  ArticleStatus.DRAFT,
  ArticleStatus.PENDING_APPROVAL,
  ArticleStatus.NEEDS_CHANGES,
  ArticleStatus.PUBLISHED,
  ArticleStatus.ARCHIVED,
];

export async function generateArticle(
  game: IGeneratedGame,
  category: { id: string; name: string },
  author: { id: string },
  articleIndex: number,
  status: ArticleStatus = ArticleStatus.PUBLISHED
) {
  // 10% chance for article to be deleted
  const shouldBeDeleted = articleIndex % 10 === 0;
  let previousStatus: ArticleStatus = ArticleStatus.DRAFT;

  if (shouldBeDeleted) {
    previousStatus =
      possiblePreviousStatuses[articleIndex % possiblePreviousStatuses.length];
    status = ArticleStatus.DELETED;
  }

  const isReview = category.name === 'Tests';
  const template = isReview
    ? articleTemplates.review
    : articleTemplates.preview;
  const slug = generateArticleSlug(game.slug, articleIndex);

  // Variables de template communes
  const templateVars = {
    game: game.title,
    developer: game.developer.name,
  };

  // Générer le titre
  const title = replaceTemplateVars(
    getByIndex(template.titles, articleIndex),
    templateVars
  );

  // Générer le contenu
  let content = '';

  if (isReviewTemplate(template)) {
    const hours = ((articleIndex % 80) + 20).toString();
    const intro = replaceTemplateVars(
      getByIndex(template.introTemplates, articleIndex),
      { ...templateVars, hours }
    );

    const gameplay = replaceTemplateVars(
      getByIndex(template.gameplayTemplates, articleIndex),
      {
        ...templateVars,
        gameplay_quality: getByIndex(
          ['innovant', 'solide', 'satisfaisant', 'enthousiasmant'],
          articleIndex
        ),
        gameplay_detail: faker.lorem.paragraph(),
      }
    );

    const graphics = replaceTemplateVars(
      getByIndex(template.graphicsTemplates, articleIndex),
      {
        ...templateVars,
        graphics_quality: getByIndex(
          ['magnifique', 'impressionnant', 'réussi', 'convaincant'],
          articleIndex
        ),
        graphics_detail: faker.lorem.paragraph(),
      }
    );

    const conclusion = replaceTemplateVars(
      getByIndex(template.conclusionTemplates, articleIndex),
      {
        ...templateVars,
        final_verdict: getByIndex(
          [
            'une vraie réussite',
            'une belle surprise',
            'un titre incontournable',
            'une expérience unique',
          ],
          articleIndex
        ),
        conclusion_detail: faker.lorem.paragraph(),
      }
    );

    content = `${intro}\n\n${gameplay}\n\n${graphics}\n\n${conclusion}`;
  } else if (!isReviewTemplate(template)) {
    const intro = replaceTemplateVars(
      getByIndex(template.introTemplates, articleIndex),
      templateVars
    );

    const previewContent = replaceTemplateVars(
      getByIndex(template.contentTemplates, articleIndex),
      {
        ...templateVars,
        preview_impression: getByIndex(
          [
            'vraiment impressionnés',
            'laissé une excellente impression',
            'beaucoup intrigués',
          ],
          articleIndex
        ),
        preview_detail: faker.lorem.paragraphs(3),
      }
    );

    content = `${intro}\n\n${previewContent}`;
  } else {
    throw new Error('Template type mismatch');
  }

  // Vérifie si l'article existe déjà
  const existingArticle = await prisma.article.findUnique({
    where: { slug },
    include: { approvalHistory: true },
  });

  if (existingArticle) {
    // Mise à jour de l'article existant
    return await prisma.article.update({
      where: { id: existingArticle.id },
      data: {
        title,
        content,
        status,
        publishedAt:
          status === ArticleStatus.PUBLISHED ? faker.date.recent() : null,
      },
      include: {
        approvalHistory: true,
      },
    });
  }

  // Création d'un nouvel article
  const article = await prisma.article.create({
    data: {
      slug,
      title,
      content,
      status,
      publishedAt:
        status === ArticleStatus.PUBLISHED ? faker.date.recent() : null,
      deletedAt: status === ArticleStatus.DELETED ? faker.date.recent() : null,
      previousStatus:
        status === ArticleStatus.DELETED
          ? possiblePreviousStatuses[
              articleIndex % possiblePreviousStatuses.length
            ]
          : null,
      user: { connect: { id: author.id } },
      category: { connect: { id: category.id } },
      games: {
        connect: { slug: game.slug },
      },
    },
    include: {
      approvalHistory: true,
    },
  });

  // Créer l'historique d'approbation si nécessaire
  // Create history entries
  if (status === ArticleStatus.DELETED) {
    // For deleted articles, first create history for previous status if not DRAFT
    if (previousStatus !== ArticleStatus.DRAFT) {
      // Initial submission
      await prisma.articleApprovalHistory.create({
        data: {
          articleId: article.id,
          fromStatus: ArticleStatus.DRAFT,
          toStatus: ArticleStatus.PENDING_APPROVAL,
          action: 'SUBMITTED',
          actionById: author.id,
          comment: 'Article soumis pour approbation',
        },
      });

      // If published, add approval step
      if (previousStatus === ArticleStatus.PUBLISHED) {
        await prisma.articleApprovalHistory.create({
          data: {
            articleId: article.id,
            fromStatus: ArticleStatus.PENDING_APPROVAL,
            toStatus: ArticleStatus.PUBLISHED,
            action: 'APPROVED',
            actionById: author.id,
            comment: 'Article approuvé et publié',
          },
        });
      }
    }

    // Then create the deletion entry
    await prisma.articleApprovalHistory.create({
      data: {
        articleId: article.id,
        fromStatus: previousStatus,
        toStatus: ArticleStatus.DELETED,
        action: 'DELETED',
        actionById: author.id,
        comment: 'Article supprimé',
      },
    });
  } else if (status !== ArticleStatus.DRAFT) {
    // For non-deleted articles
    await prisma.articleApprovalHistory.create({
      data: {
        articleId: article.id,
        fromStatus: ArticleStatus.DRAFT,
        toStatus: ArticleStatus.PENDING_APPROVAL,
        action: 'SUBMITTED',
        actionById: author.id,
        comment: 'Article soumis pour approbation',
      },
    });

    if (status === ArticleStatus.PUBLISHED) {
      await prisma.articleApprovalHistory.create({
        data: {
          articleId: article.id,
          fromStatus: ArticleStatus.PENDING_APPROVAL,
          toStatus: ArticleStatus.PUBLISHED,
          action: 'APPROVED',
          actionById: author.id,
          comment: 'Article approuvé et publié',
        },
      });
    }
  }
  return article;
}
