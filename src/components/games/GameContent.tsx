'use client';

import { Box, Paper } from '@mui/material';

interface IGameContentProps {
  description?: string;
  maxHeight?: string | number;
  showOverflow?: boolean;
}

export const GameContent = ({
  description,
  maxHeight,
  showOverflow = false,
}: IGameContentProps) => {
  return (
    <Paper
      elevation={0}
      sx={theme => ({
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        overflow: showOverflow ? 'auto' : 'hidden',
        maxHeight,
        borderRadius: 1,
        p: 4,
      })}
    >
      {description && (
        <Box
          component='div'
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {description}
        </Box>
      )}
    </Paper>
  );
};
