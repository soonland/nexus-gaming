/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

/**
 * Seed initial reference data (categories, platforms, companies)
 */
export async function seedReferenceData() {
  try {
    console.log('Création des données de référence...');

    // Create categories
    console.log('Création des catégories...');
    await prisma.category.upsert({
      where: { name: 'Actualités' },
      update: {},
      create: { name: 'Actualités' },
    });

    await prisma.category.upsert({
      where: { name: 'Tests' },
      update: {},
      create: { name: 'Tests' },
    });

    await prisma.category.upsert({
      where: { name: 'Previews' },
      update: {},
      create: { name: 'Previews' },
    });

    // Create platforms
    console.log('Création des plateformes...');
    await prisma.platform.upsert({
      where: { name: 'Nintendo Switch' },
      update: {},
      create: {
        name: 'Nintendo Switch',
        manufacturer: 'Nintendo',
        releaseDate: dayjs('2017-03-03').toDate(),
        color: '#E60012', // Rouge Nintendo
      },
    });

    await prisma.platform.upsert({
      where: { name: 'PlayStation 5' },
      update: {},
      create: {
        name: 'PlayStation 5',
        manufacturer: 'Sony',
        releaseDate: dayjs('2020-11-12').toDate(),
        color: '#00439C', // Bleu PlayStation
      },
    });

    await prisma.platform.upsert({
      where: { name: 'PC' },
      update: {},
      create: {
        name: 'PC',
        manufacturer: 'Multiple',
        releaseDate: null,
        color: '#333333', // Gris neutre
      },
    });

    // Create companies
    console.log('Création des entreprises...');
    await prisma.company.upsert({
      where: { name: 'Nintendo' },
      update: {},
      create: {
        name: 'Nintendo',
        isDeveloper: true,
        isPublisher: true,
      },
    });

    await prisma.company.upsert({
      where: { name: 'Insomniac Games' },
      update: {},
      create: {
        name: 'Insomniac Games',
        isDeveloper: true,
        isPublisher: false,
      },
    });

    await prisma.company.upsert({
      where: { name: 'Sony Interactive Entertainment' },
      update: {},
      create: {
        name: 'Sony Interactive Entertainment',
        isDeveloper: false,
        isPublisher: true,
      },
    });

    await prisma.company.upsert({
      where: { name: 'Larian Studios' },
      update: {},
      create: {
        name: 'Larian Studios',
        isDeveloper: true,
        isPublisher: true,
      },
    });

    console.log('✓ Données de référence créées');
  } catch (error) {
    console.error(
      'Erreur lors de la création des données de référence:',
      error
    );
    throw error;
  }
}
