import { Chip, type ChipProps } from '@mui/material';

export interface ICategoryChipProps extends Omit<ChipProps, 'color' | 'label'> {
  name: string;
  bgColor?: string;
}

export const CategoryChip = ({
  name,
  bgColor,
  size = 'small',
  ...props
}: ICategoryChipProps) => {
  return (
    <Chip
      label={name}
      size={size}
      sx={{
        'backgroundColor': bgColor || 'primary.main',
        'color': 'white',
        '&:hover': {
          backgroundColor: bgColor || 'primary.dark',
        },
      }}
      {...props}
    />
  );
};
