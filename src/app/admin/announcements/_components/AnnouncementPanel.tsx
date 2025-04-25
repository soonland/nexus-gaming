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
import { alpha, useTheme } from '@mui/material/styles';
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

import type { IAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import type { IAnnouncement } from '@/hooks/useAnnouncements';

import { getAnnouncementTypeStyle } from './announcementStyles';

type AnnouncementItem = IAnnouncement | IAdminAnnouncement;

const typeIcons: Record<AnnouncementType, React.ElementType> = {
  INFO: FiInfo,
  ATTENTION: FiAlertCircle,
  URGENT: FiAlertTriangle,
};

const PRIORITY_ORDER: Record<AnnouncementType, number> = {
  URGENT: 1,
  ATTENTION: 2,
  INFO: 3,
};

interface IAnnouncementPanelProps {
  announcements: AnnouncementItem[];
}

const ExpandButton = ({
  expanded,
  hasNews,
  onClick,
}: {
  expanded: boolean;
  hasNews: boolean;
  onClick: () => void;
}) => {
  return (
    <IconButton
      size='small'
      sx={{
        '@keyframes pulse': {
          '0%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(-2px)' },
          '100%': { transform: 'translateX(-50%) translateY(0)' },
        },
        'animation': hasNews ? 'pulse 2s infinite' : 'none',
        'bgcolor': 'background.paper',
        'border': 1,
        'borderColor': 'divider',
        'bottom': -12,
        'height': 24,
        'left': '50%',
        'position': 'absolute',
        'transform': 'translateX(-50%)',
        'transition': 'transform 0.3s',
        'width': 24,
        '& svg': {
          transition: 'transform 0.3s',
          transform: expanded ? 'rotate(180deg)' : 'none',
        },
        '&:hover': {
          bgcolor: 'background.paper',
        },
      }}
      onClick={onClick}
    >
      <FiChevronDown size={16} />
    </IconButton>
  );
};

export const AnnouncementPanel = ({
  announcements,
}: IAnnouncementPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sortedAnnouncements = [...announcements]
    .filter(announcement => {
      if ('isActive' in announcement) {
        return (
          announcement.isActive === 'active' &&
          (announcement.expiresAt
            ? new Date(announcement.expiresAt) > new Date()
            : true)
        );
      }
      return announcement.expiresAt
        ? new Date(announcement.expiresAt) > new Date()
        : true;
    })
    .sort((a, b) => PRIORITY_ORDER[a.type] - PRIORITY_ORDER[b.type]);

  const isNew = (date: Date) => {
    const fiveDaysAgo = subDays(new Date(), 5);
    return isAfter(date, fiveDaysAgo);
  };

  const newAnnouncementsCount = sortedAnnouncements.filter(a =>
    isNew(new Date(a.createdAt))
  ).length;

  return (
    <Box sx={{ position: 'relative', pb: 2 }}>
      <Card>
        <Stack
          alignItems='center'
          direction='row'
          spacing={2}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            p: 2,
          }}
        >
          <Typography sx={{ fontWeight: 500 }} variant='h6'>
            Annonces ({sortedAnnouncements.length})
          </Typography>
          {newAnnouncementsCount > 0 && (
            <Chip
              color='primary'
              label={`${newAnnouncementsCount} nouvelle${
                newAnnouncementsCount > 1 ? 's' : ''
              }`}
              size='small'
            />
          )}
        </Stack>

        <Collapse
          in={isExpanded}
          sx={{
            transition: theme.transitions.create('height', {
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <Stack spacing={0.5} sx={{ p: 2 }}>
            {sortedAnnouncements.map(announcement => {
              const type = announcement.type as AnnouncementType;
              const style = getAnnouncementTypeStyle(type);
              const Icon = typeIcons[type];

              return (
                <Card
                  key={announcement.id}
                  raised={false}
                  sx={{
                    'bgcolor': () => alpha(style.color, isDark ? 0.3 : 0.03),
                    'borderLeft': 4,
                    'borderLeftColor': style.color,
                    'borderRadius': 1,
                    'boxShadow': isDark ? 4 : 1,
                    'p': 2,
                    'transition': theme.transitions.create(
                      ['background-color'],
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    '&:hover': {
                      bgcolor: () => alpha(style.color, isDark ? 0.35 : 0.05),
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack
                      alignItems='center'
                      direction='row'
                      justifyContent='space-between'
                      spacing={2}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          gap: 1.5,
                        }}
                      >
                        <Icon size={18} style={{ color: style.color }} />
                        <Typography
                          sx={{
                            color: style.color,
                            fontWeight: 600,
                          }}
                          variant='subtitle1'
                        >
                          {style.label}
                        </Typography>
                        {isNew(new Date(announcement.createdAt)) && (
                          <Chip color='primary' label='Nouveau' size='small' />
                        )}
                      </Box>
                      {announcement.expiresAt && (
                        <Typography
                          sx={{ color: 'text.secondary' }}
                          variant='caption'
                        >
                          Expire le{' '}
                          {dayjs(announcement.expiresAt).format('YYYY-MM-DD')}
                        </Typography>
                      )}
                    </Stack>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        lineHeight: 1.6,
                      }}
                      variant='body2'
                    >
                      {announcement.message}
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Collapse>
      </Card>
      <ExpandButton
        expanded={isExpanded}
        hasNews={newAnnouncementsCount > 0}
        onClick={() => setIsExpanded(!isExpanded)}
      />
    </Box>
  );
};
