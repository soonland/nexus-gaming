'use client';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { FiAlignJustify } from 'react-icons/fi';

import { ArticleCard } from '@/components/articles/ArticleCard';
import type { IArticleData } from '@/types/api';

interface IRelatedArticlesProps {
  articles: Array<Partial<IArticleData>>;
  title?: string;
  showIcon?: boolean;
  iconSize?: number;
}

export const RelatedArticles = ({
  articles,
  title = 'Articles liés',
  showIcon = true,
  iconSize = 20,
}: IRelatedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <Box>
      <Stack alignItems='center' direction='row' spacing={1} sx={{ mb: 2 }}>
        {showIcon && <FiAlignJustify size={iconSize} />}
        <Typography variant='h5'>{title}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {articles.map(article => {
          if (!article.id || !article.title) return null;

          return (
            <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ArticleCard
                article={{
                  id: article.id,
                  title: article.title,
                  content: article.content || '',
                  category: article.category || {
                    id: 'uncategorized',
                    name: 'Non catégorisé',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  user: article.user || {
                    id: 'unknown',
                    username: 'Anonyme',
                    role: 'USER',
                  },
                  status: 'PUBLISHED',
                  publishedAt: article.publishedAt,
                  games: article.games || [],
                  createdAt: article.createdAt || new Date().toISOString(),
                  updatedAt: article.updatedAt || new Date().toISOString(),
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
