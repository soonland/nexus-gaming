'use client';

import { Box, Stack, Typography } from '@mui/material';
import { FiClock } from 'react-icons/fi';

import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';
import { canViewApprovalHistory } from '@/lib/permissions';

import { getStatusStyle } from './articleStyles';
import type { IArticleWithRelations } from './form';

interface IArticleHistoryViewProps {
  article: IArticleWithRelations;
}

export const ArticleHistoryView = ({ article }: IArticleHistoryViewProps) => {
  const { user } = useAuth();

  if (
    !canViewApprovalHistory(user?.role, { userId: article.user.id }, user?.id)
  ) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          fontStyle: 'italic',
        }}
      >
        Vous n'avez pas les permissions pour voir l'historique d'approbation
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Stack alignItems='center' direction='row' spacing={1}>
          <FiClock size={20} />
          <Typography variant='h6'>Historique d'approbation</Typography>
        </Stack>
        {article.approvalHistory?.length ? (
          <Stack spacing={2} sx={{ mt: 2 }}>
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
              mt: 2,
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
    </Stack>
  );
};
