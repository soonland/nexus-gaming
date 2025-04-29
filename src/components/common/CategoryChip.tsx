'use client';

import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

export interface ICategoryChipProps {
  category: {
    id: string;
    name: string;
    color?: string | null;
  };
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
  clickable?: boolean;
  onChipClick?: (category: { id: string; name: string }) => void;
}

export const CategoryChip = ({
  category,
  size = 'small',
  variant = 'outlined',
  clickable,
  onChipClick,
}: ICategoryChipProps) => {
  const { color } = category;

  return (
    <Chip
      color={color ? undefined : 'info'}
      label={category.name}
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
        clickable && onChipClick ? () => onChipClick(category) : undefined
      }
    />
  );
};
