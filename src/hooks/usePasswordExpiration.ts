import { useMemo } from 'react';

import dayjs from '@/lib/dayjs';

import { useAuth } from './useAuth';

interface IPasswordExpirationInfo {
  daysUntilExpiration: number;
  warningLevel: 'none' | 'info' | 'warning' | 'urgent' | 'expired';
  expirationDate: string;
  lastPasswordChange: string;
}

export const usePasswordExpiration = (): IPasswordExpirationInfo | null => {
  const { user } = useAuth();

  const expirationInfo = useMemo(() => {
    if (!user?.lastPasswordChange) {
      return null;
    }

    const now = dayjs();
    const lastChange = dayjs(user.lastPasswordChange);
    const expirationDate = lastChange.add(90, 'days');
    const daysUntilExpiration = Math.max(0, expirationDate.diff(now, 'day'));
    let warningLevel: IPasswordExpirationInfo['warningLevel'] = 'none';
    if (daysUntilExpiration <= 0) {
      warningLevel = 'expired';
    } else if (daysUntilExpiration <= 3) {
      warningLevel = 'urgent';
    } else if (daysUntilExpiration <= 5) {
      warningLevel = 'warning';
    } else if (daysUntilExpiration <= 7) {
      warningLevel = 'info';
    }

    return {
      daysUntilExpiration,
      warningLevel,
      expirationDate: expirationDate.toISOString(),
      lastPasswordChange: user.lastPasswordChange,
    };
  }, [user?.lastPasswordChange]);

  return expirationInfo;
};
