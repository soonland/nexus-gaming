'use client';

import { Box, Paper, type Theme } from '@mui/material';

interface IArticleContentProps {
  content: string;
  variant?: 'outlined' | 'contained';
  maxHeight?: string | number;
  showOverflow?: boolean;
}

const getStyles = (theme: Theme, variant: 'outlined' | 'contained') => ({
  backgroundColor:
    variant === 'contained' ? theme.palette.background.paper : 'transparent',
  border:
    variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
  borderRadius: 1,
  p: 4,
});

export const ArticleContent = ({
  content,
  variant = 'outlined',
  maxHeight,
  showOverflow = false,
}: IArticleContentProps) => {
  return (
    <Paper
      elevation={0}
      sx={theme => ({
        ...getStyles(theme, variant),
        overflow: showOverflow ? 'auto' : 'hidden',
        maxHeight,
      })}
    >
      <Box
        component='div'
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </Box>
    </Paper>
  );
};
