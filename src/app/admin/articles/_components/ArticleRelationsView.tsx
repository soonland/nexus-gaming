'use client';

import { Box, Stack, Typography } from '@mui/material';
import { FiMonitor } from 'react-icons/fi';

import type { IArticleWithRelations } from './form';

interface IArticleRelationsViewProps {
  article: IArticleWithRelations;
}

export const ArticleRelationsView = ({
  article,
}: IArticleRelationsViewProps) => {
  return (
    <Stack spacing={4}>
      {/* Relations avec les jeux */}
      <Box>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiMonitor size={20} />
          <Typography variant='h6'>Jeux associés</Typography>
        </Stack>
        <Stack
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          {article.games.length > 0 ? (
            <Stack direction='row' sx={{ flexWrap: 'wrap', gap: 1 }}>
              {article.games.map(game => (
                <Typography
                  key={game.id}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  }}
                  variant='subtitle2'
                >
                  {game.title}
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography color='text.secondary' variant='body2'>
              Aucun jeu associé à cet article
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};
