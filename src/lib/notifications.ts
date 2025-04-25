import { NotificationType } from '@prisma/client';

import type { NotificationLevel } from '@/types/notifications';

export const isValidNotificationType = (
  type: string
): type is NotificationType => {
  return Object.values(NotificationType).includes(type as NotificationType);
};

export const isValidNotificationLevel = (
  level: string
): level is NotificationLevel =>
  level === 'info' ||
  level === 'warning' ||
  level === 'urgent' ||
  level === 'error';

export const validateRequiredFields = (
  title: string,
  message: string,
  level: string
): string | null => {
  if (!title?.trim()) return 'Title is required';
  if (!message?.trim()) return 'Message is required';
  if (!['info', 'warning', 'urgent', 'error'].includes(level)) {
    return 'Valid level is required (info, warning, urgent, error)';
  }
  return null;
};
