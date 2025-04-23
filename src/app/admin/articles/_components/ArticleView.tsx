'use client';

import { Box, Stack, Typography } from '@mui/material';
import { FiTag, FiCalendar, FiUser } from 'react-icons/fi';

import { ColorDot } from '@/components/common';
import dayjs from '@/lib/dayjs';

import { getStatusStyle } from './articleStyles';
import type { IArticleWithRelations } from './form';

interface IArticleViewProps {
  article: IArticleWithRelations;
}

export const ArticleView = ({ article }: IArticleViewProps) => {
  return (
    <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto', py: 4 }}>
      {/* Métadonnées */}
      <Stack direction='row' spacing={3} sx={{ color: 'text.secondary' }}>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiUser />
          <Typography>{article.user.username}</Typography>
        </Stack>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiCalendar />
          <Typography>{dayjs(article.createdAt).format('LL')}</Typography>
        </Stack>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiTag />
          <Typography>{article.category.name}</Typography>
        </Stack>
        <ColorDot
          color={getStatusStyle(article.status).color}
          label={getStatusStyle(article.status).label}
        />
      </Stack>

      {/* Image de couverture */}
      {article.heroImage && (
        <Box
          alt={article.title}
          component='img'
          src={article.heroImage}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      )}

      {/* Contenu */}
      <Typography
        component='div'
        dangerouslySetInnerHTML={{ __html: article.content }}
        sx={{
          'typography': 'body1',
          '& h1': { typography: 'h4', mt: 4, mb: 2 },
          '& h2': { typography: 'h5', mt: 3, mb: 2 },
          '& h3': { typography: 'h6', mt: 2, mb: 1 },
          '& p': { mb: 2 },
          '& ul, & ol': { mb: 2, pl: 4 },
          '& li': { mb: 0.5 },
          '& a': {
            'color': 'primary.main',
            'textDecoration': 'none',
            '&:hover': { textDecoration: 'underline' },
          },
        }}
      />

      {/* Jeux associés */}
      {article.games.length > 0 && (
        <Box>
          <Typography gutterBottom variant='h6'>
            Jeux associés
          </Typography>
          <Stack direction='row' spacing={1}>
            {article.games.map(game => (
              <Typography
                key={game.id}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
                variant='body2'
              >
                {game.title}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      {/* Historique d'approbation */}
      {article.approvalHistory && article.approvalHistory.length > 0 && (
        <Box>
          <Typography gutterBottom variant='h6'>
            Historique d'approbation
          </Typography>
          <Stack spacing={2}>
            {article.approvalHistory.map(history => (
              <Box
                key={history.id}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Stack
                  alignItems='center'
                  direction='row'
                  justifyContent='space-between'
                  mb={1}
                >
                  <Typography variant='subtitle2'>
                    {history.actionBy.username}
                  </Typography>
                  <Typography color='text.secondary' variant='caption'>
                    {dayjs(history.createdAt).format('LLL')}
                  </Typography>
                </Stack>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <ColorDot
                    color={getStatusStyle(history.fromStatus).color}
                    label={getStatusStyle(history.fromStatus).label}
                  />
                  <Typography>→</Typography>
                  <ColorDot
                    color={getStatusStyle(history.toStatus).color}
                    label={getStatusStyle(history.toStatus).label}
                  />
                </Stack>
                {history.comment && (
                  <Typography
                    color='text.secondary'
                    sx={{ mt: 1 }}
                    variant='body2'
                  >
                    {history.comment}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};
