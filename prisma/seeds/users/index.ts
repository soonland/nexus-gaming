/* eslint-disable no-console */
import { generateUserGroup } from './generators';
import { userTemplates } from './templates';

/**
 * Configuration de la génération des utilisateurs
 */
interface IUserGenConfig {
  [key: string]: {
    count?: number; // Nombre d'utilisateurs par rôle (sauf le premier rôle du template)
    enabled: boolean;
  };
}

const defaultConfig: IUserGenConfig = {
  editorial: {
    count: 2, // 2 senior editors + 2 editors
    enabled: true,
  },
  moderation: {
    count: 2, // 2 moderators
    enabled: true,
  },
  admin: {
    count: 2, // 2 admins + 2 sysadmins
    enabled: true,
  },
  regular: {
    count: 10, // 10 utilisateurs réguliers
    enabled: true,
  },
};

/**
 * Génère les utilisateurs initiaux
 */
export async function generateUsers(config: IUserGenConfig = defaultConfig) {
  try {
    console.log('Début de la génération des utilisateurs...');

    // Parcourir chaque type d'utilisateur
    for (const [templateName, template] of Object.entries(userTemplates)) {
      const templateConfig = config[templateName];

      // Vérifie si la génération est activée pour ce template
      if (!templateConfig?.enabled) {
        console.log(`⏭️ Génération désactivée pour : ${templateName}`);
        continue;
      }

      console.log(`\nGénération des utilisateurs ${templateName}...`);
      const users = await generateUserGroup(
        templateName,
        template,
        templateConfig.count
      );

      // Log des utilisateurs créés/mis à jour
      users.forEach(user => {
        console.log(`✓ ${user.role}: ${user.username} (${user.email})`);
        if (user.notificationPrefs.length) {
          console.log(
            `  ↳ ${user.notificationPrefs.length} préférences de notification`
          );
        }
        if (user.socialProfiles.length) {
          console.log(`  ↳ ${user.socialProfiles.length} profils sociaux`);
        }
      });
    }

    console.log('\nGénération des utilisateurs terminée !');
  } catch (error) {
    console.error('Erreur lors de la génération des utilisateurs:', error);
    throw error;
  }
}

// Export pour l'utilisation dans les seeds
export const seedUsers = generateUsers;
