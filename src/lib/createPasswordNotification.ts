import type { IPasswordExpirationInfo } from '@/hooks/usePasswordExpiration';
import type { NotificationLevel, INotification } from '@/types/notifications';

export function createPasswordNotification(
  passwordExpiration: IPasswordExpirationInfo | null,
  userId: string | undefined
): INotification | null {
  if (!passwordExpiration || passwordExpiration.warningLevel === 'none') {
    return null;
  }

  const level: NotificationLevel = (() => {
    switch (passwordExpiration.warningLevel) {
      case 'expired':
      case 'urgent':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  })();

  const title: string = (() => {
    switch (passwordExpiration.warningLevel) {
      case 'expired':
        return 'Votre mot de passe a expiré';
      case 'urgent':
        return 'Expiration imminente';
      case 'warning':
        return 'Expiration approche';
      case 'info':
        return 'Pensez à changer votre mot de passe';
      default:
        return '';
    }
  })();

  const message =
    passwordExpiration.warningLevel === 'expired'
      ? 'Pour votre sécurité, veuillez mettre à jour votre mot de passe immédiatement.'
      : `Il vous reste ${passwordExpiration.daysUntilExpiration} jours pour changer votre mot de passe.`;

  return {
    id: 'password-expiration',
    userId: userId || '',
    type: 'PASSWORD_EXPIRATION',
    level,
    title,
    message,
    isRead: false,
    data: {
      daysUntilExpiration: passwordExpiration.daysUntilExpiration,
      warningLevel: passwordExpiration.warningLevel,
    },
    createdAt: new Date(),
    expiresAt: null,
  };
}
