/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

import { seedAdmin } from './seeds/admin';
import { generateContent } from './seeds/content';
import { seedEditorial } from './seeds/editorial';
import { seedReferenceData } from './seeds/reference-data';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Début du seeding...\n');

    // 1. Create reference data (categories, platforms, companies)
    await seedReferenceData();

    // 2. Create admin users
    await seedAdmin();

    // 3. Create editorial team
    await seedEditorial();

    // 4. Generate content
    await generateContent(10, 3); // 10 jeux avec 3 articles chacun

    console.log('\nSeeding terminé !');
  } catch (error) {
    console.error('Erreur pendant le seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('Erreur non gérée:', e);
  process.exit(1);
});
