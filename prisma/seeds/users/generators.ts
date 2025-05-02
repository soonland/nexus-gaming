import type { Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import type { IUserTemplate } from './templates';
import { generateUserData } from './utils';

const prisma = new PrismaClient();

/**
 * Génère un utilisateur de manière déterministe
 */
export async function generateUser(
  template: IUserTemplate,
  role: Role,
  index: number
) {
  const userData = await generateUserData(template, role, index);

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await prisma.user.findFirst({
    where: { email: userData.email },
    include: {
      notificationPrefs: true,
      socialProfiles: true,
    },
  });

  if (existingUser) {
    // Mise à jour de l'utilisateur existant
    return await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        username: userData.username,
        password: userData.password,
        role: userData.role,
        isActive: userData.isActive,
        notificationPrefs: {
          deleteMany: {}, // Supprime les anciennes préférences
          createMany: {
            data: userData.notificationPrefs,
          },
        },
        socialProfiles: {
          deleteMany: {}, // Supprime les anciens profils
          createMany: {
            data: userData.socialProfiles,
          },
        },
      },
      include: {
        notificationPrefs: true,
        socialProfiles: true,
      },
    });
  }

  // Création d'un nouvel utilisateur
  return await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      isActive: userData.isActive,
      notificationPrefs: {
        createMany: {
          data: userData.notificationPrefs,
        },
      },
      socialProfiles: {
        createMany: {
          data: userData.socialProfiles,
        },
      },
    },
    include: {
      notificationPrefs: true,
      socialProfiles: true,
    },
  });
}

/**
 * Génère un groupe d'utilisateurs basé sur un template
 */
export async function generateUserGroup(
  templateName: string,
  template: IUserTemplate,
  count: number = 1
) {
  const users = [];
  let userIndex = 0;

  // Pour chaque rôle, créer le nombre d'utilisateurs spécifié
  for (const role of template.roles) {
    for (let i = 0; i < count; i++) {
      const user = await generateUser(template, role, userIndex++);
      users.push(user);
    }
  }

  return users;
}
