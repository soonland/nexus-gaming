'use client';

import {
  FiBell,
  FiFileText,
  FiAtSign,
  FiRefreshCw,
  FiKey,
} from 'react-icons/fi';

import type { NotificationLevel } from '@/types/notifications';

interface INotificationIconProps {
  type: string;
  level?: NotificationLevel;
  size?: number;
}

// Map notification type to icon and default color
const iconMap = {
  ARTICLE_REVIEW: FiFileText,
  STATUS_CHANGE: FiRefreshCw,
  MENTION: FiAtSign,
  SYSTEM_ALERT: FiBell,
  PASSWORD_EXPIRATION: FiKey,
} as const;

// Map level to color
const levelColorMap = {
  info: '#2196f3', // Blue
  warning: '#ff9800', // Orange
  urgent: '#f44336', // Red
  error: '#d32f2f', // Dark Red
} as const;

export const NotificationIcon = ({
  level = 'info',
  size = 18,
  type,
}: INotificationIconProps) => {
  const Icon = iconMap[type as keyof typeof iconMap] || FiBell;
  const color = level ? levelColorMap[level] : undefined;

  return <Icon color={color} size={size} />;
};
