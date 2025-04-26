'use client';

import { Stack, Typography, type StackProps } from '@mui/material';
import { FiUser } from 'react-icons/fi';

import { DateDisplay } from '@/components/common/DateDisplay';

interface IArticleMetaProps extends Omit<StackProps, 'children'> {
  username: string;
  publishedAt: Date | string;
  showIcon?: boolean;
  iconSize?: number;
}

export const ArticleMeta = ({
  username,
  publishedAt,
  showIcon = true,
  iconSize = 16,
  ...stackProps
}: IArticleMetaProps) => {
  return (
    <Stack alignItems='center' direction='row' spacing={3} {...stackProps}>
      <Stack alignItems='center' direction='row' spacing={1}>
        {showIcon && <FiUser size={iconSize} />}
        <Typography variant='body2'>{username}</Typography>
      </Stack>
      <DateDisplay
        date={
          typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt
        }
      />
    </Stack>
  );
};
