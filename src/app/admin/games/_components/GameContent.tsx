'use client';

import { Box, Stack, Typography } from '@mui/material';

import dayjs from '@/lib/dayjs';
import type { IGameData } from '@/types/api';

interface IGameContentProps {
  game: IGameData;
}

export const GameContent = ({ game }: IGameContentProps) => {
  return (
    <Stack spacing={4}>
      {/* Image de couverture */}
      {game.coverImage && (
        <Box
          alt={game.title}
          component='img'
          src={game.coverImage}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      )}

      {/* Genre et Date de sortie */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
        }}
      >
        {game.genre && (
          <Stack direction='row' spacing={1}>
            <Typography color='text.secondary' variant='subtitle2'>
              Genre:
            </Typography>
            <Typography variant='subtitle2'>{game.genre}</Typography>
          </Stack>
        )}
        {game.releaseDate && (
          <Stack direction='row' spacing={1}>
            <Typography color='text.secondary' variant='subtitle2'>
              Date de sortie:
            </Typography>
            <Typography variant='subtitle2'>
              {dayjs(game.releaseDate).format('LL')}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Description */}
      {game.description && (
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            component='div'
            sx={{
              'typography': 'body1',
              'whiteSpace': 'pre-wrap',
              'wordBreak': 'break-word',
              '& p': { mb: 2 },
              '& ul, & ol': { mb: 2, pl: 4 },
              '& li': { mb: 0.5 },
              '& a': {
                'color': 'primary.main',
                'textDecoration': 'none',
                '&:hover': { textDecoration: 'underline' },
              },
            }}
          >
            {game.description}
          </Typography>
        </Box>
      )}

      {/* Plateformes */}
      {game.platforms.length > 0 && (
        <Box>
          <Typography gutterBottom variant='h6'>
            Plateformes
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction='row' flexWrap='wrap' gap={2}>
              {game.platforms.map(platform => (
                <Stack key={platform.id} spacing={0.5}>
                  <Typography variant='subtitle2'>{platform.name}</Typography>
                  <Stack alignItems='center' direction='row' spacing={1}>
                    <Typography color='text.secondary' variant='body2'>
                      {platform.manufacturer}
                    </Typography>
                    {platform.releaseDate && (
                      <>
                        <Typography color='text.secondary' variant='body2'>
                          •
                        </Typography>
                        <Typography color='text.secondary' variant='body2'>
                          {dayjs(platform.releaseDate).format('LL')}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      )}

      {/* Compagnies */}
      <Stack spacing={2}>
        <Typography variant='h6'>Compagnies</Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2}>
            <Stack direction='row' spacing={1}>
              <Typography color='text.secondary' variant='subtitle2'>
                Développeur:
              </Typography>
              <Typography variant='subtitle2'>{game.developer.name}</Typography>
            </Stack>
            <Stack direction='row' spacing={1}>
              <Typography color='text.secondary' variant='subtitle2'>
                Éditeur:
              </Typography>
              <Typography variant='subtitle2'>{game.publisher.name}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};
