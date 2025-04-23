'use client';

import { Box, Tooltip, Typography, type Theme } from '@mui/material';

interface IColorDotProps {
  label: string;
  color: string;
  size?: number;
  tooltip?: string;
}

export const ColorDot = ({
  label,
  color,
  size = 10,
  tooltip,
}: IColorDotProps) => {
  const dotElement = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
          flexShrink: 0,
          transition: (theme: Theme) =>
            theme.transitions.create('background-color', {
              duration: theme.transitions.duration.shortest,
            }),
        }}
      />
      <Typography variant='body2'>{label}</Typography>
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip placement='top' title={tooltip}>
        {dotElement}
      </Tooltip>
    );
  }

  return dotElement;
};
