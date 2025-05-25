import { seedUsers } from './users';

// Configuration des utilisateurs administrateurs
const adminConfig = {
  admin: {
    count: 2, // 2 admins + 2 sysadmins (défini par le template)
    enabled: true,
  },
  editorial: {
    enabled: false, // Les éditeurs sont générés ailleurs
  },
  moderation: {
    enabled: false, // Les modérateurs sont générés ailleurs
  },
  regular: {
    count: 10, // 10 utilisateurs réguliers
    enabled: true, // Les utilisateurs réguliers sont générés avec les admins
  },
};

export const seedAdmin = async () => {
  try {
    await seedUsers(adminConfig);
  } catch (error) {
    console.error('Error seeding admin team:', error);
    throw error;
  }
};
