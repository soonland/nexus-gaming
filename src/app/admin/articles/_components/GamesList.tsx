import { Box, Chip, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import type { IGameData } from '@/types';

interface IGamesListProps {
  games: IGameData[];
}

export const GamesList = ({ games }: IGamesListProps) => (
  <Stack direction='row' flexWrap='wrap' gap={1}>
    {games.map(game => (
      <Link key={game.id} passHref href={`/games/${game.id}`}>
        <Box
          component='span'
          sx={{
            alignItems: 'center',
            cursor: 'pointer',
            display: 'inline-flex',
            gap: 1,
          }}
        >
          <Chip
            clickable
            avatar={
              game.coverImage ? (
                <Image
                  alt={game.title}
                  height={24}
                  src={game.coverImage}
                  width={24}
                />
              ) : undefined
            }
            label={game.title}
            size='small'
          />
        </Box>
      </Link>
    ))}
  </Stack>
);
