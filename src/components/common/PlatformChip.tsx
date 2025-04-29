'use client';

import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

export interface IPlatformChipProps {
  platform: {
    id: string;
    name: string;
    color?: string | null;
  };
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
  clickable?: boolean;
  onChipClick?: (platform: { id: string; name: string }) => void;
}

export const PlatformChip = ({
  platform,
  size = 'small',
  variant = 'outlined',
  clickable,
  onChipClick,
}: IPlatformChipProps) => {
  const { color } = platform;

  return (
    <Chip
      color={color ? undefined : 'info'}
      label={platform.name}
      size={size}
      sx={{
        'color': 'common.white',
        'borderColor': color || undefined,
        'backgroundColor': color ? `${color}` : undefined,
        '&:hover': clickable
          ? {
              backgroundColor: color ? '#000' : undefined,
            }
          : undefined,
        '& .MuiChip-label': {
          color: 'common.white',
        },
      }}
      variant={variant}
      onClick={
        clickable && onChipClick ? () => onChipClick(platform) : undefined
      }
    />
  );
};
