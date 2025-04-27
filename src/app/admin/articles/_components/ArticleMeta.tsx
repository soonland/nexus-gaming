'use client';

import { Stack, Typography } from '@mui/material';
import { FiCalendar, FiTag, FiUser } from 'react-icons/fi';

import { ColorDot } from '@/components/common';
import dayjs from '@/lib/dayjs';

import { getStatusStyle } from './articleStyles';
import type { IArticleWithRelations } from './form';

interface IArticleMetaProps {
  article: IArticleWithRelations;
}

export const ArticleMeta = ({ article }: IArticleMetaProps) => {
  return (
    <Stack direction='row' spacing={3} sx={{ color: 'text.secondary' }}>
      <Stack alignItems='center' direction='row' spacing={1}>
        <FiUser />
        <Typography>{article.user.username}</Typography>
      </Stack>
      <Stack alignItems='center' direction='row' spacing={1}>
        <FiCalendar />
        <Typography>{dayjs(article.createdAt).format('LL')}</Typography>
      </Stack>
      <Stack alignItems='center' direction='row' spacing={1}>
        <FiTag />
        <Typography>{article.category.name}</Typography>
      </Stack>
      <ColorDot
        color={getStatusStyle(article.status).color}
        label={getStatusStyle(article.status).label}
      />
    </Stack>
  );
};
