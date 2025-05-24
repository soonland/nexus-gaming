import type { NotificationType, Role, SocialPlatform } from '@prisma/client';
import { hash } from 'bcrypt';

import type { IUserTemplate } from './templates';

const SALT_ROUNDS = 10;

/**
 * Génère un nom d'utilisateur déterministe
 */
export function generateUsername(
  prefix: string,
  role: Role,
  index: number
): string {
  return `${prefix}${index + 1}`;
}

/**
 * Génère un email déterministe
 */
export function generateEmail(username: string, domain: string): string {
  return `${username}@${domain}`;
}

/**
 * Hache un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS);
}

/**
 * Génère les préférences de notification par défaut
 */
export function generateNotificationPreferences(
  notifications: NotificationType[]
): { type: NotificationType; email: boolean; inApp: boolean }[] {
  return notifications.map(type => ({
    type,
    email: true,
    inApp: true,
  }));
}

/**
 * Génère les profils sociaux par défaut avec des noms d'utilisateur cohérents
 */
export function generateSocialProfiles(
  platforms: SocialPlatform[],
  username: string
): { platform: SocialPlatform; username: string }[] {
  return platforms.map(platform => ({
    platform,
    username: `${username}_${platform.toLowerCase()}`,
  }));
}

/**
 * Génère les données d'un utilisateur basées sur un template
 */
export async function generateUserData(
  template: IUserTemplate,
  role: Role,
  index: number
) {
  const username = generateUsername(template.namePrefix, role, index);
  const email = generateEmail(username, template.baseDomain);
  const hashedPassword = await hashPassword(template.basePassword);

  return {
    username,
    email,
    password: hashedPassword,
    role,
    isActive: true,
    notificationPrefs: generateNotificationPreferences(
      template.defaultPreferences.notifications
    ),
    socialProfiles: template.defaultPreferences.socialPlatforms
      ? generateSocialProfiles(
          template.defaultPreferences.socialPlatforms,
          username
        )
      : [],
  };
}
