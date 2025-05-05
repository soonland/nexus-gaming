'use client';

import { Box, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FaGamepad } from 'react-icons/fa';

import type { GameData } from '@/types';

import { GameCardMiniature } from '../games/GameCardMiniature';

interface IRelatedGamesProps {
  games: Array<Partial<GameData>>;
  title?: string;
  showIcon?: boolean;
  iconSize?: number;
}

const mockPlatform = {
  id: 'platform-1',
  name: 'PC',
  manufacturer: 'Multiple',
  releaseDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const RelatedGames = ({
  games,
  title = 'Jeux mentionnés',
  showIcon = true,
  iconSize = 20,
}: IRelatedGamesProps) => {
  if (games.length === 0) return null;

  return (
    <Box pb={4}>
      <Stack alignItems='center' direction='row' spacing={1} sx={{ mb: 2 }}>
        {showIcon && <FaGamepad size={iconSize} />}
        <Typography variant='h5'>{title}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {games.map(game => {
          if (!game.id || !game.title) return null;

          return (
            <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <GameCardMiniature
                game={{
                  id: game.id,
                  title: game.title,
                  description: game.description || undefined,
                  coverImage: game.coverImage || undefined,
                  releaseDate: game.releaseDate
                    ? dayjs(game.releaseDate).format('YYYY-MM-DD')
                    : undefined,
                  platforms: game.platforms || [mockPlatform],
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
