import {
  Box,
  IconButton,
  Popover,
  Typography,
  Button,
  Stack,
  useTheme,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useRef, useState } from 'react';
import { FiBell, FiBarChart } from 'react-icons/fi';

import { NotificationIcon } from '@/components/common/NotificationIcon';
import { isValidNotificationLevel } from '@/lib/notifications';
import type { INotification, NotificationLevel } from '@/types/notifications';

interface IBaseNotificationBellProps {
  notifications: INotification[];
  isMarkingAsRead?: boolean;
  isMarkingAllAsRead?: boolean;
  icon?: React.ReactNode;
  popoverWidth?: number;
  onMarkAllAsRead?: (ids: string[]) => void;
  onNotificationClick?: (notification: INotification) => void;
  onAction?: (notification: INotification) => void;
}

type ThemeColor = 'info' | 'warning' | 'error';

const DEFAULT_LEVEL: NotificationLevel = 'info';

const getLevelColor = (level: NotificationLevel): ThemeColor => {
  switch (level) {
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'urgent':
    case 'error':
      return 'error';
  }
};

const styles = {
  root: {
    position: 'relative',
  },
  notification: {
    'borderRadius': 1,
    'cursor': 'pointer',
    'p': 1,
    'transition': 'background-color 0.2s',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },
  notificationRead: {
    opacity: 0.7,
  },
  indicator: {
    position: 'absolute',
    right: -1,
    top: -1,
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  iconButton: {
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  spinner: {
    ml: 1,
    color: 'inherit',
  },
  buttonProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  markAllButton: {
    padding: '4px',
  },
} as const;

export const BaseNotificationBell = ({
  notifications,
  isMarkingAsRead,
  isMarkingAllAsRead,
  icon,
  popoverWidth = 300,
  onMarkAllAsRead,
  onNotificationClick,
  onAction,
}: IBaseNotificationBellProps) => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [updatingNotificationId, setUpdatingNotificationId] = useState<
    string | null
  >(null);

  // Show indicator if there are any unread notifications
  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  // Get the highest severity level for the indicator color
  const getHighestLevel = (
    notifications: INotification[]
  ): NotificationLevel => {
    if (!notifications.length) return DEFAULT_LEVEL;

    const levels: Record<NotificationLevel, number> = {
      info: 0,
      warning: 1,
      urgent: 2,
      error: 2,
    };

    // Safety check and cast notification levels using the type guard
    const validNotifications = notifications.filter(
      (n): n is INotification & { level: NotificationLevel } =>
        isValidNotificationLevel(n.level)
    );

    return validNotifications.reduce<NotificationLevel>(
      (highest, notification) =>
        levels[notification.level as NotificationLevel] > levels[highest]
          ? (notification.level as NotificationLevel)
          : highest,
      DEFAULT_LEVEL
    );
  };

  const highestLevel = notifications.length
    ? getHighestLevel(notifications.filter(n => !n.isRead))
    : DEFAULT_LEVEL;
  const themeColor = getLevelColor(highestLevel);
  const indicatorColor = hasUnreadNotifications
    ? theme.palette[themeColor].main
    : undefined;

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications
      .filter(n => !n.isRead && n.type !== 'PASSWORD_EXPIRATION')
      .map(n => n.id);

    if (unreadIds.length > 0 && onMarkAllAsRead) {
      onMarkAllAsRead(unreadIds);
    }
  };

  const handleMarkAsRead = (notification: INotification) => {
    setUpdatingNotificationId(notification.id);
    onAction?.(notification);
  };

  return (
    <>
      <Box
        ref={anchorRef}
        sx={styles.root}
        onClick={e => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <IconButton aria-label='Notifications' sx={styles.iconButton}>
          {icon || <FiBell size={20} />}
        </IconButton>
        {hasUnreadNotifications && (
          <Box
            sx={{
              ...styles.indicator,
              bgcolor: indicatorColor,
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
      </Box>
      <Popover
        PaperProps={{
          sx: {
            width: popoverWidth,
            p: 2,
          },
        }}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setOpen(false)}
      >
        {notifications.length > 0 ? (
          <>
            <Box sx={styles.header}>
              <Typography variant='h6'>Notifications</Typography>
              {hasUnreadNotifications && onMarkAllAsRead && (
                <Tooltip title='Tout marquer comme lu'>
                  <IconButton
                    color='primary'
                    disabled={isMarkingAllAsRead}
                    size='small'
                    sx={styles.markAllButton}
                    onClick={handleMarkAllAsRead}
                  >
                    {isMarkingAllAsRead ? (
                      <CircularProgress size={20} />
                    ) : (
                      <FiBarChart
                        size={20}
                        style={{
                          transform: 'rotate(-90deg) scaleY(-1)',
                        }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Stack spacing={2}>
              {notifications.map(notification => (
                <Box
                  key={notification.id}
                  sx={{
                    ...styles.notification,
                    ...(notification.isRead && styles.notificationRead),
                  }}
                  onClick={() => onNotificationClick?.(notification)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationIcon
                      level={notification.level as NotificationLevel}
                      type={notification.type}
                    />
                    <Typography variant='subtitle2'>
                      {notification.title}
                    </Typography>
                  </Box>
                  <Typography color='text.secondary' variant='body2'>
                    {notification.message}
                  </Typography>
                  {onAction &&
                    !notification.isRead &&
                    notification.type !== 'PASSWORD_EXPIRATION' && (
                      <Box sx={{ mt: 1 }}>
                        <Button
                          color={
                            isValidNotificationLevel(notification.level)
                              ? getLevelColor(
                                  notification.level as NotificationLevel
                                )
                              : 'info'
                          }
                          disabled={
                            isMarkingAsRead &&
                            updatingNotificationId === notification.id
                          }
                          size='small'
                          variant='outlined'
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkAsRead(notification);
                          }}
                        >
                          <Box sx={styles.buttonProgress}>
                            <span>Marquer comme lu</span>
                            {isMarkingAsRead &&
                              updatingNotificationId === notification.id && (
                                <CircularProgress
                                  size={16}
                                  sx={styles.spinner}
                                />
                              )}
                          </Box>
                        </Button>
                      </Box>
                    )}
                </Box>
              ))}
            </Stack>
          </>
        ) : (
          <Typography color='text.secondary' variant='body2'>
            Aucune notification
          </Typography>
        )}
      </Popover>
    </>
  );
};
