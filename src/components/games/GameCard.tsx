'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import Link from 'next/link';

import { DateDisplay } from '@/components/common/DateDisplay';
import { PlatformChip } from '@/components/common/PlatformChip';
import { getCloudinaryUrl } from '@/lib/cloudinary/urls';
import type { IGameData } from '@/types';

interface IGameCardProps {
  game: Partial<IGameData>;
}

export const GameCard = ({ game }: IGameCardProps) => {
  const theme = useTheme();

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
        image={
          game.coverImage
            ? getCloudinaryUrl(game.coverImage, {
                width: 400,
                height: 200,
                quality: 80,
              })
            : '/images/placeholder-game.png'
        }
        sx={{ objectFit: 'cover' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/images/placeholder-game.png';
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {/* Titre et description */}
          <Stack spacing={1}>
            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              variant='h6'
            >
              {game.title}
            </Typography>
            <Typography
              color='text.secondary'
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              variant='body2'
            >
              {game.description}
            </Typography>
          </Stack>

          {/* Date de sortie */}
          {game.releaseDate && (
            <Stack
              alignItems='center'
              direction='row'
              spacing={1}
              sx={{ color: theme.palette.primary.main }}
            >
              <DateDisplay
                color='text.secondary'
                date={game.releaseDate}
                format='calendar'
              />
            </Stack>
          )}

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
