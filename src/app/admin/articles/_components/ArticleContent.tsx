'use client';

import { Box, Stack, Typography } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';
import { canViewApprovalHistory } from '@/lib/permissions';

import { getStatusStyle } from './articleStyles';
import type { IArticleWithRelations } from './form';

interface IArticleContentProps {
  article: IArticleWithRelations;
}

export const ArticleContent = ({ article }: IArticleContentProps) => {
  const { user } = useAuth();

  return (
    <Stack spacing={4}>
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
        >
          {article.content}
        </Typography>
      </Box>

      {/* Tags */}

      {/* Jeux associés */}
      {article.games.length > 0 && (
        <Box>
          <Typography gutterBottom variant='h6'>
            Jeux associés
          </Typography>
          <Stack direction='row' flexGrow={1} spacing={2}>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
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
            </Box>
          </Stack>
        </Box>
      )}

      {/* Historique d'approbation */}
      {canViewApprovalHistory(
        user?.role,
        { userId: article.user.id },
        user?.id
      ) && (
        <Box>
          <Typography gutterBottom variant='h6'>
            Historique d'approbation
          </Typography>
          {article.approvalHistory?.length ? (
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
                    <Box
                      sx={{
                        color: getStatusStyle(history.fromStatus).color,
                        fontSize: '0.875rem',
                      }}
                    >
                      {getStatusStyle(history.fromStatus).label}
                    </Box>
                    <Typography>→</Typography>
                    <Box
                      sx={{
                        color: getStatusStyle(history.toStatus).color,
                        fontSize: '0.875rem',
                      }}
                    >
                      {getStatusStyle(history.toStatus).label}
                    </Box>
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
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'action.hover',
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Aucun historique d'approbation pour cet article
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );
};
