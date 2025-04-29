'use client';

import { Box, Stack, Typography } from '@mui/material';

import type { IArticleWithRelations } from './form';

interface IArticleContentViewProps {
  article: IArticleWithRelations;
}

export const ArticleContentView = ({ article }: IArticleContentViewProps) => {
  return (
    <Stack spacing={4}>
      {/* Image de couverture */}
      {article.heroImage && (
        <Box>
          <Typography gutterBottom color='text.secondary' variant='subtitle2'>
            Image de couverture
          </Typography>
          <Box
            alt={article.title}
            component='img'
            src={article.heroImage}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        </Box>
      )}

      {/* Contenu */}
      <Box>
        <Typography gutterBottom color='text.secondary' variant='subtitle2'>
          Contenu de l'article
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            component='div'
            sx={{
              'typography': 'body1',
              '& h1': { typography: 'h4', mt: 4, mb: 2 },
              '& h2': { typography: 'h5', mt: 3, mb: 2 },
              '& h3': { typography: 'h6', mt: 2, mb: 1 },
              '& p': { mb: 2 },
              '& ul, & ol': { mb: 2, pl: 4 },
              '& li': { mb: 0.5 },
              '& a': {
                'color': 'primary.main',
                'textDecoration': 'none',
                '&:hover': { textDecoration: 'underline' },
              },
            }}
          >
            {article.content}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};
