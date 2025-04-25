import type { NotificationType, SystemNotification } from '@prisma/client';

export type { NotificationType };

export type NotificationLevel = 'info' | 'warning' | 'urgent' | 'error';

export interface INotification extends Omit<SystemNotification, 'data'> {
  data: Record<string, unknown> | null;
}

export interface INotificationPreference {
  id: string;
  type: NotificationType;
  email: boolean;
  inApp: boolean;
  userId: string;
}

export interface IUpdateNotificationPreference {
  type: NotificationType;
  email?: boolean;
  inApp?: boolean;
}

export interface IUpdateNotificationParams {
  id: string;
  isRead: boolean;
}

export interface IMarkMultipleAsReadParams {
  ids: string[];
}

export interface IMarkMultipleAsReadResponse {
  count: number;
}

export interface IBroadcastNotification {
  type: 'SYSTEM_ALERT';
  level: NotificationLevel;
  title: string;
  message: string;
  expiresAt: string | null;
}

export const NOTIFICATION_TYPES = {
  ARTICLE_REVIEW: {
    label: "Revue d'articles",
    description: 'Notifications concernant les articles à réviser',
  },
  STATUS_CHANGE: {
    label: 'Changement de statut',
    description: 'Notifications de changement de statut des articles',
  },
  MENTION: {
    label: 'Mentions',
    description: "Notifications quand quelqu'un vous mentionne",
  },
  SYSTEM_ALERT: {
    label: 'Alertes système',
    description: 'Notifications importantes du système',
  },
  PASSWORD_EXPIRATION: {
    label: 'Expiration du mot de passe',
    description: "Notifications concernant l'expiration du mot de passe",
  },
} as const satisfies Record<
  NotificationType,
  { label: string; description: string }
>;
