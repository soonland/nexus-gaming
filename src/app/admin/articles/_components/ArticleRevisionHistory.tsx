import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { ApprovalAction } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { SideColorBadge } from '@/components/common';
import type { IApprovalHistoryData } from '@/types/api';

const getStatusColor = (action: ApprovalAction): string => {
  switch (action) {
    case 'SUBMITTED':
      return '#3498db'; // Blue
    case 'APPROVED':
      return '#2ecc71'; // Green
    case 'CHANGES_NEEDED':
      return '#e67e22'; // Orange
    case 'ARCHIVED':
      return '#95a5a6'; // Gray
    default:
      return '#bdc3c7'; // Light Gray
  }
};

const getActionLabel = (action: ApprovalAction): string => {
  switch (action) {
    case 'SUBMITTED':
      return 'Soumis';
    case 'APPROVED':
      return 'Approuvé';
    case 'CHANGES_NEEDED':
      return 'Modifications requises';
    case 'ARCHIVED':
      return 'Archivé';
    default:
      return action;
  }
};

interface IArticleRevisionHistoryProps {
  history: IApprovalHistoryData[];
}

export const ArticleRevisionHistory = ({
  history,
}: IArticleRevisionHistoryProps) => {
  return (
    <Stack spacing={2}>
      <Typography color='text.secondary' sx={{ pl: 1 }} variant='subtitle2'>
        Historique des révisions
      </Typography>
      {history.map(entry => (
        <SideColorBadge key={entry.id} color={getStatusColor(entry.action)}>
          <Card sx={{ width: '100%' }} variant='outlined'>
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  alignItems='center'
                  direction='row'
                  justifyContent='space-between'
                  spacing={1}
                >
                  <Typography variant='subtitle2'>
                    {getActionLabel(entry.action)}
                  </Typography>
                  <Typography color='text.secondary' variant='caption'>
                    {formatDistanceToNow(new Date(entry.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </Typography>
                </Stack>
                <Typography color='text.secondary' variant='body2'>
                  Par {entry.actionBy.username}
                </Typography>
                {entry.comment && (
                  <Typography
                    sx={{
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      mt: 1,
                      p: 1,
                    }}
                    variant='body2'
                  >
                    {entry.comment}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </SideColorBadge>
      ))}
    </Stack>
  );
};
