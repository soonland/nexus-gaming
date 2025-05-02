'use client';

import { Chip, useTheme } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Chip
      color={color ? undefined : 'info'}
      label={platform.name}
      size={size}
      sx={{
        'borderColor': color || undefined,
        'backgroundColor': color ? alpha(color, isDark ? 0.7 : 1) : undefined,
        'color': theme.palette.getContrastText(
          color || theme.palette.info.main
        ),
        '&:hover': clickable
          ? {
              backgroundColor: color
                ? alpha(color, isDark ? 0.9 : 0.8)
                : undefined,
            }
          : undefined,
        '& .MuiChip-label': {
          color: 'inherit',
        },
      }}
      variant={variant}
      onClick={
        clickable && onChipClick ? () => onChipClick(platform) : undefined
      }
    />
  );
};
