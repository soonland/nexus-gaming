/* eslint-disable no-console */
import { PrismaClient, ArticleStatus, Role } from '@prisma/client';

import { generateArticle, generateGame } from './generators';

const prisma = new PrismaClient();

/**
 * Configuration de la génération de contenu
 */
interface IContentGenConfig {
  gameCount: number;
  articlesPerGame: number;
}

const defaultConfig: IContentGenConfig = {
  gameCount: 10,
  articlesPerGame: 3,
};

/**
 * Génère le contenu initial (jeux et articles)
 */
export async function generateContent(
  gameCount: number = defaultConfig.gameCount,
  articlesPerGame: number = defaultConfig.articlesPerGame
) {
  try {
    console.log('Début de la génération de contenu...');

    // Récupérer les données nécessaires
    const companies = await prisma.company.findMany();
    const platforms = await prisma.platform.findMany();
    const categories = await prisma.category.findMany();
    const editors = await prisma.user.findMany({
      where: {
        role: { in: [Role.EDITOR, Role.SENIOR_EDITOR] },
      },
      include: { articles: true },
    });

    // Vérifier la présence des données requises
    if (
      !companies.length ||
      !platforms.length ||
      !categories.length ||
      !editors.length
    ) {
      throw new Error(
        'Données de référence manquantes (entreprises, plateformes, catégories ou éditeurs)'
      );
    }

    console.log(`Génération de ${gameCount} jeux...`);
    const games = [];
    for (let i = 0; i < gameCount; i++) {
      const game = await generateGame(companies, platforms, i);
      games.push(game);
      console.log(`✓ Jeu généré/mis à jour : ${game.title}`);
    }

    console.log(`\nGénération de ${articlesPerGame} articles par jeu...`);
    for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
      const game = games[gameIndex];
      for (
        let articleIndex = 0;
        articleIndex < articlesPerGame;
        articleIndex++
      ) {
        const globalIndex = gameIndex * articlesPerGame + articleIndex;
        const category = categories[globalIndex % categories.length];
        const author = editors[globalIndex % editors.length];
        const status = [
          ArticleStatus.DRAFT,
          ArticleStatus.PENDING_APPROVAL,
          ArticleStatus.PUBLISHED,
          ArticleStatus.PUBLISHED,
          ArticleStatus.PUBLISHED,
        ][globalIndex % 5];

        const article = await generateArticle(
          game,
          category,
          author,
          articleIndex,
          status
        );
        console.log(
          `✓ Article généré/mis à jour : ${article.title} (${status})`
        );
      }
    }

    console.log('\nGénération de contenu terminée !');
  } catch (error) {
    console.error('Erreur lors de la génération de contenu:', error);
    throw error;
  }
}
