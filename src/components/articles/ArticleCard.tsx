'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import Link from 'next/link';

import { CategoryChip, DateDisplay } from '@/components/common';
import type { ArticleData } from '@/types';

interface IArticleCardProps {
  article: ArticleData;
}

export const ArticleCard = ({ article }: IArticleCardProps) => {
  return (
    <Card
      component={Link}
      href={`/articles/${article.id}`}
      sx={{
        'height': '100%',
        'display': 'flex',
        'flexDirection': 'column',
        'transition': 'transform 0.2s',
        'textDecoration': 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        alt={article.title}
        component='img'
        height={200}
        image={article.heroImage || '/images/placeholder-game.png'}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              gutterBottom
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              variant='h6'
            >
              {article.title}
            </Typography>
            <Stack alignItems='center' direction='row' spacing={1}>
              <CategoryChip
                category={article.category}
                size='small'
                variant='filled'
              />
              {article.publishedAt && (
                <DateDisplay
                  color='text.secondary'
                  date={article.publishedAt}
                  format='calendar'
                />
              )}
            </Stack>
          </Box>
          {article.games.length > 0 && (
            <Stack direction='row' flexWrap='wrap' spacing={1}>
              {article.games.map(game => (
                <Chip
                  key={game.id}
                  label={game.title}
                  size='small'
                  variant='outlined'
                />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
