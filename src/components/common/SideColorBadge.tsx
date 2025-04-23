import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ISideColorBadgeProps {
  children: ReactNode;
  color?: string;
}

export const SideColorBadge = ({
  children,
  color = '#e0e0e0',
}: ISideColorBadgeProps) => {
  return (
    <Box
      sx={{
        'display': 'flex',
        'position': 'relative',
        '&::before': {
          bgcolor: color,
          borderRadius: '4px 0 0 4px',
          bottom: 0,
          content: '""',
          left: 0,
          position: 'absolute',
          top: 0,
          width: 4,
        },
      }}
    >
      {children}
    </Box>
  );
};
