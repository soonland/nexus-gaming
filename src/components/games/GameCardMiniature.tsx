'use client';

import { Card, CardContent, CardMedia, Typography, Stack } from '@mui/material';
import Link from 'next/link';

import { PlatformChip } from '@/components/common/PlatformChip';
import type { GameData } from '@/types';

interface IGameCardProps {
  game: Partial<GameData>;
}

export const GameCardMiniature = ({ game }: IGameCardProps) => {
  if (!game) {
    console.warn('GameCard rendered without game data');
    return null;
  }

  return (
    <Card
      component={Link}
      href={`/games/${game.id}`}
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
        alt={game.title}
        component='img'
        height={200}
        image={game.coverImage || '/images/placeholder-game.png'}
        sx={{ objectFit: 'cover' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/images/placeholder-game.png';
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Titre et description */}
        <Stack spacing={1}>
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            variant='body2'
          >
            {game.title}
          </Typography>
          {/* Plateformes */}
          {Array.isArray(game.platforms) && game.platforms.length > 0 && (
            <Stack direction='row' flexWrap='wrap' spacing={1}>
              {game.platforms.map(platform => (
                <PlatformChip
                  key={platform.id}
                  platform={platform}
                  size='small'
                />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
