'use client';

import { Card, CardContent, CardMedia, Skeleton } from '@mui/material';

export const ArticleCardSkeleton = () => {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia>
        <Skeleton
          animation='wave'
          height={200}
          sx={{ transform: 'scale(1, 1)' }}
          variant='rectangular'
        />
      </CardMedia>
      <CardContent>
        <Skeleton
          animation='wave'
          height={32}
          sx={{ marginBottom: 1 }}
          width='80%'
        />
        <Skeleton animation='wave' height={20} width='40%' />
        <Skeleton
          animation='wave'
          height={60}
          sx={{ marginTop: 2 }}
          width='100%'
        />
      </CardContent>
    </Card>
  );
};
