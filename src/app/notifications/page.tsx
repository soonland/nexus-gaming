'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiCheck, FiRefreshCw } from 'react-icons/fi';

import { NotificationIcon } from '@/components/common/NotificationIcon';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';
import { createPasswordNotification } from '@/lib/createPasswordNotification';
import type { INotification, NotificationLevel } from '@/types/notifications';
import { NOTIFICATION_TYPES } from '@/types/notifications';

// Fonction utilitaire pour le niveau de notification
function getLevelColor(
  level: string
): 'info' | 'warning' | 'error' | 'success' {
  if (!['info', 'warning', 'error', 'success'].includes(level)) return 'info';
  return level as 'info' | 'warning' | 'error' | 'success';
}

function getNotificationTypeLabel(type: string) {
  if (NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.label) {
    return NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES].label;
  }
  return type;
}

const NotificationCard = ({
  notification,
  onMarkAsRead,
  isPending,
}: {
  notification: INotification;
  onMarkAsRead: (notification: INotification) => void;
  isPending: boolean;
}) => {
  const borderColor = notification.isRead
    ? 'transparent'
    : `${getLevelColor(notification.level)}.main`;

  return (
    <Paper
      sx={{
        p: 3,
        opacity: notification.isRead ? 0.7 : 1,
        borderLeft: notification.isRead ? 'none' : `4px solid`,
        borderLeftColor: borderColor,
        transition: 'opacity 0.2s, border-color 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <NotificationIcon
          level={notification.level as NotificationLevel}
          type={notification.type}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography component='h3' variant='h6'>
              {notification.title}
            </Typography>
            <Chip
              color={getLevelColor(notification.level)}
              label={getNotificationTypeLabel(notification.type)}
              size='small'
              variant='outlined'
            />
            {!notification.isRead && (
              <Chip
                color='primary'
                label='Non lu'
                size='small'
                variant='filled'
              />
            )}
          </Box>
          <Typography color='text.secondary' sx={{ mb: 2 }} variant='body1'>
            {notification.message}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography color='text.disabled' variant='body2'>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </Typography>
            {!notification.isRead &&
              notification.type !== 'PASSWORD_EXPIRATION' && (
                <Tooltip title='Marquer comme lu'>
                  <IconButton
                    color='primary'
                    disabled={isPending}
                    size='small'
                    onClick={() => onMarkAsRead(notification)}
                  >
                    {isPending ? (
                      <CircularProgress size={16} />
                    ) : (
                      <FiCheck size={16} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const LoadingComponent = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
    <CircularProgress />
  </Box>
);

const NoNotificationComponent = () => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <Typography color='text.secondary' sx={{ mb: 1 }} variant='h6'>
      Aucune notification
    </Typography>
    <Typography color='text.disabled' variant='body2'>
      Vous n'avez aucune notification pour le moment.
    </Typography>
  </Paper>
);

const UnreadNotifications: React.FC<{
  unreadNotifications: INotification[];
  updateNotification: any;
  handleMarkAsRead: (notification: INotification) => void;
}> = ({ unreadNotifications, updateNotification, handleMarkAsRead }) => (
  <Box>
    <Typography sx={{ mb: 2, color: 'primary.main' }} variant='h6'>
      Non lues ({unreadNotifications.length})
    </Typography>
    <Stack spacing={2}>
      {unreadNotifications.map(notification => (
        <NotificationCard
          key={notification.id}
          isPending={updateNotification.isPending}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}
    </Stack>
  </Box>
);

const ReadNotifications: React.FC<{
  readNotifications: INotification[];
  updateNotification: any;
  handleMarkAsRead: (notification: INotification) => void;
}> = ({ readNotifications, updateNotification, handleMarkAsRead }) => (
  <Box>
    <Typography sx={{ mb: 2, color: 'text.secondary' }} variant='h6'>
      Lues ({readNotifications.length})
    </Typography>
    <Stack spacing={2}>
      {readNotifications.map(notification => (
        <NotificationCard
          key={notification.id}
          isPending={updateNotification.isPending}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}
    </Stack>
  </Box>
);

const NotificationsPage = () => {
  const { user } = useAuth();
  const passwordExpiration = usePasswordExpiration();
  const {
    notifications: systemNotifications,
    isLoading,
    error,
    updateNotification,
    markAllAsRead,
  } = useNotifications();

  const passwordNotification = createPasswordNotification(
    passwordExpiration,
    user?.id
  );

  const allNotifications = [...systemNotifications];
  if (passwordNotification) {
    allNotifications.push(passwordNotification);
  }
  allNotifications.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unreadNotifications = allNotifications.filter(n => !n.isRead);
  const readNotifications = allNotifications.filter(n => n.isRead);

  if (!user) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Alert severity='warning'>
          Vous devez être connecté pour accéder à vos notifications.
        </Alert>
      </Container>
    );
  }

  function handleMarkAsRead(notification: INotification) {
    if (notification.type === 'PASSWORD_EXPIRATION') return;
    updateNotification.mutate({ id: notification.id, isRead: true });
  }

  function handleMarkAllAsRead() {
    const unreadIds = unreadNotifications
      .filter(n => n.type !== 'PASSWORD_EXPIRATION')
      .map(n => n.id);
    if (unreadIds.length > 0) {
      markAllAsRead.mutate({ ids: unreadIds });
    }
  }

  const total = allNotifications.length;
  const unreadCount = unreadNotifications.length;

  const summaryText = (() => {
    if (total === 0) {
      return 'Aucune notification';
    }
    const pluralTotal = total > 1 ? 's' : '';
    const pluralUnread = unreadCount > 1 ? 's' : '';
    return `${total} notification${pluralTotal} • ${unreadCount} non lue${pluralUnread}`;
  })();

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography component='h1' variant='h4'>
            Notifications
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Button
                disabled={markAllAsRead.isPending}
                startIcon={
                  markAllAsRead.isPending ? (
                    <CircularProgress size={16} />
                  ) : (
                    <FiCheck />
                  )
                }
                variant='outlined'
                onClick={handleMarkAllAsRead}
              >
                Tout marquer comme lu
              </Button>
            )}
            <Tooltip title='Actualiser'>
              <IconButton
                disabled={isLoading}
                onClick={() => window.location.reload()}
              >
                {isLoading ? <CircularProgress size={20} /> : <FiRefreshCw />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography color='text.secondary' variant='body1'>
          {summaryText}
        </Typography>
      </Box>
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          Erreur lors du chargement des notifications. Veuillez réessayer.
        </Alert>
      )}
      {isLoading && <LoadingComponent />}
      {total === 0 && <NoNotificationComponent />}
      {total !== 0 && (
        <Stack spacing={3}>
          {unreadNotifications.length > 0 && (
            <UnreadNotifications
              handleMarkAsRead={handleMarkAsRead}
              unreadNotifications={unreadNotifications}
              updateNotification={updateNotification}
            />
          )}
          {unreadNotifications.length > 0 && readNotifications.length > 0 && (
            <Divider sx={{ my: 3 }} />
          )}
          {readNotifications.length > 0 && (
            <ReadNotifications
              handleMarkAsRead={handleMarkAsRead}
              readNotifications={readNotifications}
              updateNotification={updateNotification}
            />
          )}
        </Stack>
      )}
    </Container>
  );
};

export default NotificationsPage;
