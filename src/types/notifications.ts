import type { NotificationType } from '@prisma/client';

export interface INotification {
  id: string;
  type: NotificationType;
  level: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: unknown;
  expiresAt?: Date | null;
  createdAt: Date;
}

export type NotificationLevel = 'info' | 'warning' | 'urgent' | 'error';

export interface IMarkAsReadParams {
  id: string;
  isRead: boolean;
}

export interface IMarkMultipleAsReadParams {
  ids: string[];
}

export interface IMarkMultipleAsReadResponse {
  count: number;
}

export interface IUpdateNotificationParams {
  id: string;
  title?: string;
  message?: string;
  level?: NotificationLevel;
  isRead?: boolean;
  data?: Record<string, unknown> | null;
  expiresAt?: Date | null;
}
