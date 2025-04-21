'use client';

import { Chip } from '@mui/material';
import type { AnnouncementType } from '@prisma/client';
import { FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

type BadgeVariant = AnnouncementType;

interface IBadgeConfig {
  color: 'error' | 'warning' | 'info';
  icon: React.ComponentType;
}

const BADGE_CONFIG: Record<BadgeVariant, IBadgeConfig> = {
  INFO: {
    color: 'info',
    icon: FiInfo,
  },
  ATTENTION: {
    color: 'warning',
    icon: FiAlertTriangle,
  },
  URGENT: {
    color: 'error',
    icon: FiAlertCircle,
  },
};

interface IStatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export const StatusBadge = ({ variant, label }: IStatusBadgeProps) => {
  const config = BADGE_CONFIG[variant];
  const Icon = config.icon;

  return (
    <Chip
      color={config.color}
      icon={<Icon />}
      label={label || variant}
      size='small'
      variant='filled'
    />
  );
};
