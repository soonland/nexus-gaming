/* eslint-disable no-console */
import { seedUsers } from './users';

// Configuration des utilisateurs à générer
const editorConfig = {
  editorial: {
    count: 2, // 2 senior editors + 2 editors
    enabled: true,
  },
  moderation: {
    count: 2, // 2 moderators
    enabled: true,
  },
  admin: {
    enabled: false, // Les admins sont générés ailleurs
  },
  regular: {
    enabled: false, // Les utilisateurs réguliers sont générés ailleurs
  },
};

export const seedEditorial = async () => {
  try {
    await seedUsers(editorConfig);
  } catch (error) {
    console.error('Error seeding editorial team:', error);
    throw error;
  }
};
