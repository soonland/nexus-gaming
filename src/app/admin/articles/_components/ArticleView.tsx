'use client';

import { Paper, Stack } from '@mui/material';

import { ArticleContent } from './ArticleContent';
import { ArticleMeta } from './ArticleMeta';
import type { IArticleWithRelations } from './form';

interface IArticleViewProps {
  article: IArticleWithRelations;
}

export const ArticleView = ({ article }: IArticleViewProps) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={4}>
        <ArticleMeta article={article} />
        <ArticleContent article={article} />
      </Stack>
    </Paper>
  );
};
