'use client';

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import type { AnnouncementType } from '@prisma/client';
import { isAfter, subDays } from 'date-fns';
import dayjs from 'dayjs';
import { FiAlertCircle, FiAlertTriangle, FiBell, FiInfo } from 'react-icons/fi';

import { Badge } from '@/components/common';
import type { IAdminAnnouncement } from '@/hooks/useAdminAnnouncement';
import type { IAnnouncement } from '@/hooks/useAnnouncements';

import { getAnnouncementTypeStyle } from './announcementStyles';

type AnnouncementItem = IAnnouncement | IAdminAnnouncement;

const typeIcons: Record<AnnouncementType, React.ElementType> = {
  INFO: FiInfo,
  ATTENTION: FiAlertCircle,
  URGENT: FiAlertTriangle,
};

interface IAnnouncementDialogProps {
  announcements: AnnouncementItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface IGroupedAnnouncements {
  URGENT: AnnouncementItem[];
  ATTENTION: AnnouncementItem[];
  INFO: AnnouncementItem[];
}

export const AnnouncementDialog = ({
  announcements,
  isOpen,
  onClose,
}: IAnnouncementDialogProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isNew = (date: Date) => {
    const fiveDaysAgo = subDays(new Date(), 5);
    return isAfter(date, fiveDaysAgo);
  };

  // Filtrer et grouper les annonces par type
  const groupedAnnouncements = announcements.reduce<IGroupedAnnouncements>(
    (acc, announcement) => {
      if ('isActive' in announcement) {
        if (
          announcement.isActive === 'active' &&
          (!announcement.expiresAt ||
            new Date(announcement.expiresAt) > new Date())
        ) {
          acc[announcement.type].push(announcement);
        }
      } else if (
        !announcement.expiresAt ||
        new Date(announcement.expiresAt) > new Date()
      ) {
        acc[announcement.type].push(announcement);
      }
      return acc;
    },
    { URGENT: [], ATTENTION: [], INFO: [] }
  );

  // Trier les annonces dans chaque groupe par date
  Object.values(groupedAnnouncements).forEach(group => {
    group.sort(
      (a: AnnouncementItem, b: AnnouncementItem) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  const renderAnnouncementGroup = (type: AnnouncementType) => {
    const announcements = groupedAnnouncements[type];
    if (announcements.length === 0) return null;

    const style = getAnnouncementTypeStyle(type);
    const Icon = typeIcons[type];

    return (
      <Box key={type}>
        <Stack
          alignItems='center'
          direction='row'
          spacing={1.5}
          sx={{ mb: 2, mt: 3 }}
        >
          <Icon size={20} style={{ color: style.color }} />
          <Typography
            sx={{
              color: style.color,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {style.label}
          </Typography>
          {announcements.length > 0 && (
            <Badge color={style.color}>{announcements.length}</Badge>
          )}
        </Stack>
        <Stack spacing={2}>
          {announcements.map(announcement => (
            <Fade key={announcement.id} in timeout={300}>
              <Box
                sx={{
                  'bgcolor': () => alpha(style.color, isDark ? 0.15 : 0.05),
                  'borderRadius': 1,
                  'p': 2,
                  'position': 'relative',
                  'transition': theme.transitions.create(['background-color']),
                  '&:hover': {
                    bgcolor: () => alpha(style.color, isDark ? 0.2 : 0.08),
                  },
                }}
              >
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {isNew(new Date(announcement.createdAt)) && (
                      <Badge color={style.color}>Nouveau</Badge>
                    )}
                    {announcement.expiresAt && (
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          ml: 'auto',
                        }}
                      >
                        Expire le {dayjs(announcement.expiresAt).format('LL')}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {announcement.message}
                  </Typography>
                </Stack>
              </Box>
            </Fade>
          ))}
        </Stack>
      </Box>
    );
  };

  const hasAnnouncements = Object.values(groupedAnnouncements).some(
    group => group.length > 0
  );

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      transitionDuration={300}
      onClose={onClose}
    >
      <DialogTitle>
        <Stack alignItems='center' direction='row' spacing={2}>
          <FiBell size={24} />
          <Typography variant='h6'>Annonces</Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        {hasAnnouncements ? (
          <>
            {renderAnnouncementGroup('URGENT')}
            {renderAnnouncementGroup('ATTENTION')}
            {renderAnnouncementGroup('INFO')}
          </>
        ) : (
          <Typography
            color='text.secondary'
            sx={{ textAlign: 'center', py: 8 }}
            variant='body1'
          >
            Aucune annonce disponible
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
