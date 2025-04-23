'use client';

import { Card, CardContent, CardMedia, Skeleton } from '@mui/material';

export const GameCardSkeleton = () => {
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
          height={240}
          sx={{ transform: 'scale(1, 1)' }}
          variant='rectangular'
        />
      </CardMedia>
      <CardContent>
        <Skeleton
          animation='wave'
          height={28}
          sx={{ marginBottom: 1 }}
          width='70%'
        />
        <Skeleton
          animation='wave'
          height={20}
          sx={{ marginBottom: 1 }}
          width='50%'
        />
        <Skeleton
          animation='wave'
          height={20}
          sx={{ marginTop: 1 }}
          width='30%'
        />
      </CardContent>
    </Card>
  );
};
