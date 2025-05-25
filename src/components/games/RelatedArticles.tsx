'use client';

import { Box, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FiAlignJustify } from 'react-icons/fi';

import { ArticleCard } from '@/components/articles/ArticleCard';
import type { IArticleBasicData } from '@/types/api';

interface IRelatedArticlesProps {
  articles: Partial<IArticleBasicData>[];
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

  // Convert partial articles to complete IArticleBasicData
  const formattedArticles = articles
    .map(article => {
      if (!article?.id || !article.title) return null;

      const formattedArticle: IArticleBasicData = {
        id: article.id,
        title: article.title,
        content: article.content || '',
        status: article.status || 'PUBLISHED',
        publishedAt: article.publishedAt,
        category: article.category,
        user: {
          id: article.user?.id || 'unknown',
          username: article.user?.username || 'Anonyme',
          role: article.user?.role || 'USER',
        },
        games: article.games || [],
        createdAt: dayjs(article.createdAt).format(),
        updatedAt: dayjs(article.updatedAt).format(),
      };

      return formattedArticle;
    })
    .filter((article): article is IArticleBasicData => article !== null);

  return (
    <Box pb={4}>
      <Stack alignItems='center' direction='row' spacing={1} sx={{ mb: 2 }}>
        {showIcon && <FiAlignJustify size={iconSize} />}
        <Typography variant='h5'>{title}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {formattedArticles.map(article => (
          <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
