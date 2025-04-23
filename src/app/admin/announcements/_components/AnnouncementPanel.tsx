'use client';

import {
  Box,
  Card,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { AnnouncementType } from '@prisma/client';
import { isAfter, subDays } from 'date-fns';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiChevronDown,
} from 'react-icons/fi';

import { ColorDot } from '@/components/common';
import type { IAdminAnnouncement } from '@/hooks/useAdminAnnouncement';

import { getAnnouncementTypeStyle } from './announcementStyles';

const typeIcons: Record<AnnouncementType, React.ElementType> = {
  INFO: FiInfo,
  ATTENTION: FiAlertCircle,
  URGENT: FiAlertTriangle,
};

const PRIORITY_ORDER = {
  URGENT: 1,
  ATTENTION: 2,
  INFO: 3,
};

interface IAnnouncementPanelProps {
  announcements: IAdminAnnouncement[];
}

export const AnnouncementPanel = ({
  announcements,
}: IAnnouncementPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sortedAnnouncements = [...announcements]
    .filter(
      announcement =>
        announcement.isActive === 'active' &&
        (announcement.expiresAt
          ? new Date(announcement.expiresAt) > new Date()
          : true)
    )
    .sort((a, b) => PRIORITY_ORDER[a.type] - PRIORITY_ORDER[b.type]);

  const isNew = (date: Date) => {
    const fiveDaysAgo = subDays(new Date(), 5);
    return isAfter(date, fiveDaysAgo);
  };

  const newAnnouncementsCount = sortedAnnouncements.filter(a =>
    isNew(new Date(a.createdAt))
  ).length;

  return (
    <Card variant='outlined'>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        p={2}
      >
        <Box alignItems='center' display='flex' gap={2}>
          <Typography
            sx={{ fontWeight: 500, letterSpacing: '-0.01em' }}
            variant='h5'
          >
            Annonces
          </Typography>
          <Stack direction='row' spacing={1}>
            <ColorDot
              color='text.secondary'
              label={`Total : ${sortedAnnouncements.length}`}
            />

            {newAnnouncementsCount > 0 && (
              <ColorDot
                color='primary.contrastText'
                label={`Nouveau : ${newAnnouncementsCount}`}
              />
            )}
          </Stack>
        </Box>
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          <FiChevronDown
            size={20}
            style={{
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 300ms ease',
            }}
          />
        </IconButton>
      </Box>
      <Collapse
        in={isExpanded}
        sx={{
          transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box p={2}>
          <Stack spacing={2}>
            {sortedAnnouncements.map(announcement => {
              const type = announcement.type as AnnouncementType;
              const style = getAnnouncementTypeStyle(type);
              const Icon = typeIcons[type];

              return (
                <Box
                  key={announcement.id}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: style.backgroundColor,
                      px: 3,
                      py: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box alignItems='center' display='flex' gap={1}>
                      <Icon size={20} style={{ color: style.color }} />
                      <Typography
                        sx={{ color: style.color, fontWeight: 'medium' }}
                        variant='subtitle1'
                      >
                        {style.label}
                      </Typography>
                      {isNew(new Date(announcement.createdAt)) && (
                        <Chip
                          color='primary'
                          label='Nouveau'
                          size='small'
                          sx={{
                            bgcolor: 'background.paper',
                            fontWeight: 'medium',
                            color: style.color,
                          }}
                        />
                      )}
                    </Box>
                    {announcement.expiresAt && (
                      <Typography sx={{ color: style.color }} variant='body2'>
                        Expire le{' '}
                        {dayjs(announcement.expiresAt).format('YYYY-MM-DD')}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      bgcolor: 'background.paper',
                      borderTop: 1,
                      borderColor: 'divider',
                      borderTopColor: `${style.backgroundColor}33`,
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        letterSpacing: '0.01em',
                        color: 'text.primary',
                        fontWeight: 'regular',
                      }}
                    >
                      {announcement.message}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
};
