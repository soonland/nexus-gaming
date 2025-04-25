import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useNotifications } from '@/hooks/useNotifications';
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';
import type { INotification, NotificationLevel } from '@/types/notifications';

import { BaseNotificationBell } from './BaseNotificationBell';

interface IWarningConfig {
  level: NotificationLevel;
  title: string;
  type: 'PASSWORD_EXPIRATION';
  message: (days: number) => string;
}

const warningConfigs: Record<string, IWarningConfig | undefined> = {
  expired: {
    level: 'error',
    title: 'Votre mot de passe a expiré',
    type: 'PASSWORD_EXPIRATION',
    message: () =>
      'Pour votre sécurité, veuillez mettre à jour votre mot de passe immédiatement.',
  },
  urgent: {
    level: 'error',
    title: 'Expiration imminente',
    type: 'PASSWORD_EXPIRATION',
    message: days =>
      `Il vous reste ${days} jours pour changer votre mot de passe.`,
  },
  warning: {
    level: 'warning',
    title: 'Expiration approche',
    type: 'PASSWORD_EXPIRATION',
    message: days =>
      `Il vous reste ${days} jours pour changer votre mot de passe.`,
  },
  info: {
    level: 'info',
    title: 'Pensez à changer votre mot de passe',
    type: 'PASSWORD_EXPIRATION',
    message: days =>
      `Il vous reste ${days} jours pour changer votre mot de passe.`,
  },
  none: undefined,
};

export const NotificationBell = () => {
  const router = useRouter();
  const passwordExpiration = usePasswordExpiration();
  const {
    notifications: systemNotifications,
    updateNotification,
    markAllAsRead,
  } = useNotifications();

  const passwordNotifications = useMemo<INotification[]>(() => {
    if (!passwordExpiration || passwordExpiration.warningLevel === 'none') {
      return [];
    }

    const warningConfig = warningConfigs[passwordExpiration.warningLevel];
    if (!warningConfig) return [];

    return [
      {
        id: 'password-expiration',
        userId: '',
        type: warningConfig.type,
        level: warningConfig.level,
        title: warningConfig.title,
        message: warningConfig.message(passwordExpiration.daysUntilExpiration),
        isRead: false,
        data: {
          daysUntilExpiration: passwordExpiration.daysUntilExpiration,
          warningLevel: passwordExpiration.warningLevel,
        },
        createdAt: new Date(),
        expiresAt: null, // No expiration - will be deleted on password change
      },
    ];
  }, [passwordExpiration]);

  // Combine system and password notifications
  const allNotifications = [...systemNotifications, ...passwordNotifications];

  const handleAction = (notification: INotification) => {
    if (notification.type !== 'PASSWORD_EXPIRATION') {
      updateNotification.mutate(
        {
          id: notification.id,
          isRead: true,
        },
        {
          onSettled: () => {
            // This will trigger a re-render and remove the loading state
            updateNotification.reset();
          },
        }
      );
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (notification.type === 'PASSWORD_EXPIRATION') {
      router.push('/profile#password-form');
    }
  };

  const handleMarkAllAsRead = (ids: string[]) => {
    markAllAsRead.mutate(
      { ids },
      {
        onSettled: () => {
          // This will trigger a re-render and remove the loading state
          markAllAsRead.reset();
        },
      }
    );
  };

  return (
    <BaseNotificationBell
      isMarkingAllAsRead={markAllAsRead.isPending}
      isMarkingAsRead={updateNotification.isPending}
      notifications={allNotifications}
      onAction={handleAction}
      onMarkAllAsRead={handleMarkAllAsRead}
      onNotificationClick={handleNotificationClick}
    />
  );
};
