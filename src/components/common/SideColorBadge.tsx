'use client';

import { Box, Tooltip, Typography, type Theme } from '@mui/material';

interface ISideColorBadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  borderWidth?: number;
  tooltip?: string;
}

export const SideColorBadge = ({
  label,
  color,
  backgroundColor,
  borderWidth = 4,
  tooltip,
}: ISideColorBadgeProps) => {
  const badge = (
    <Box
      sx={{
        'display': 'inline-flex',
        'alignItems': 'center',
        'py': 0.75,
        'px': 1.5,
        'borderLeftWidth': borderWidth,
        'borderLeftStyle': 'solid',
        'borderColor': color,
        'bgcolor': backgroundColor,
        'borderRadius': '0 4px 4px 0',
        'transition': (theme: Theme) =>
          theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.shortest,
          }),
        '&:hover': {
          bgcolor: backgroundColor,
          borderColor: color,
        },
      }}
    >
      <Typography
        sx={{
          color: color,
          fontWeight: 500,
        }}
        variant='body2'
      >
        {label}
      </Typography>
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip placement='left' title={tooltip}>
        {badge}
      </Tooltip>
    );
  }

  return badge;
};
