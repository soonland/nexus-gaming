import { NotificationType, Role, SocialPlatform } from '@prisma/client';

export interface IUserTemplateBase {
  baseDomain: string;
  basePassword: string;
  defaultPreferences: {
    notifications: NotificationType[];
    socialPlatforms?: SocialPlatform[];
  };
}

export interface IUserTemplate extends IUserTemplateBase {
  roles: Role[];
  namePrefix: string;
}

// Configuration pour les différents types d'utilisateurs
export const userTemplates: Record<string, IUserTemplate> = {
  editorial: {
    roles: [Role.SENIOR_EDITOR, Role.EDITOR],
    baseDomain: 'nx-gaming.com',
    basePassword: 'Test123!@#',
    namePrefix: 'editor',
    defaultPreferences: {
      notifications: [
        NotificationType.ARTICLE_REVIEW,
        NotificationType.STATUS_CHANGE,
        NotificationType.MENTION,
        NotificationType.SYSTEM_ALERT,
      ],
      socialPlatforms: [SocialPlatform.TWITTER, SocialPlatform.INSTAGRAM],
    },
  },
  moderation: {
    roles: [Role.MODERATOR],
    baseDomain: 'nx-gaming.com',
    basePassword: 'Test123!@#',
    namePrefix: 'mod',
    defaultPreferences: {
      notifications: [NotificationType.MENTION, NotificationType.SYSTEM_ALERT],
      socialPlatforms: [SocialPlatform.TWITTER],
    },
  },
  admin: {
    roles: [Role.ADMIN, Role.SYSADMIN],
    baseDomain: 'nx-gaming.com',
    basePassword: 'Test123!@#',
    namePrefix: 'admin',
    defaultPreferences: {
      notifications: [
        NotificationType.ARTICLE_REVIEW,
        NotificationType.STATUS_CHANGE,
        NotificationType.MENTION,
        NotificationType.SYSTEM_ALERT,
        NotificationType.PASSWORD_EXPIRATION,
      ],
    },
  },
  regular: {
    roles: [Role.USER],
    baseDomain: 'nx-gaming.com',
    basePassword: 'User123!@#',
    namePrefix: 'user',
    defaultPreferences: {
      notifications: [NotificationType.MENTION, NotificationType.SYSTEM_ALERT],
      socialPlatforms: [SocialPlatform.STEAM, SocialPlatform.PSN],
    },
  },
};

// Configuration des profils de jeu par défaut
export const defaultGamingProfiles = {
  editor: [
    {
      platform: SocialPlatform.PSN,
      username: '{username}_psn',
    },
    {
      platform: SocialPlatform.STEAM,
      username: '{username}',
    },
    {
      platform: SocialPlatform.XBOX,
      username: '{username}xbox',
    },
  ],
  moderator: [
    {
      platform: SocialPlatform.PSN,
      username: '{username}_psn',
    },
    {
      platform: SocialPlatform.STEAM,
      username: '{username}',
    },
  ],
  regular: [
    {
      platform: SocialPlatform.PSN,
      username: '{username}_psn',
    },
    {
      platform: SocialPlatform.STEAM,
      username: '{username}',
    },
  ],
};
