import { useMemo } from 'react';

import dayjs from '@/lib/dayjs';

import { useAuth } from './useAuth';

interface PasswordExpirationInfo {
  daysUntilExpiration: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  expirationDate: string;
  lastPasswordChange: string;
}

export const usePasswordExpiration = (): PasswordExpirationInfo | null => {
  const { user } = useAuth();

  const expirationInfo = useMemo(() => {
    if (!user?.passwordExpiresAt || !user?.lastPasswordChange) {
      return null;
    }

    const now = dayjs();
    const expirationDate = dayjs(user.passwordExpiresAt);
    // Ensure we don't show negative days and handle future dates
    const daysUntilExpiration = expirationDate.isBefore(now)
      ? 0
      : Math.min(90, expirationDate.diff(now, 'day'));
    return {
      daysUntilExpiration,
      isExpired: daysUntilExpiration <= 0,
      isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 7,
      expirationDate: user.passwordExpiresAt,
      lastPasswordChange: user.lastPasswordChange,
    };
  }, [user?.passwordExpiresAt, user?.lastPasswordChange]);

  return expirationInfo;
};
