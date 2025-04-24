'use client';

import {
  Box,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { NotificationType } from '@prisma/client';

import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { NOTIFICATION_TYPES } from '@/types/notifications';

const canModifyPreference = (
  type: NotificationType,
  field: 'email' | 'inApp'
) => {
  if (type === 'SYSTEM_ALERT' && field === 'inApp') {
    return false;
  }
  return true;
};

export const NotificationSettings = () => {
  const { preferences, updatePreference, isLoading } =
    useNotificationPreferences();

  const handleToggle =
    (type: keyof typeof NOTIFICATION_TYPES) => (field: 'email' | 'inApp') => {
      if (!canModifyPreference(type, field)) return;

      const preference = preferences.find(p => p.type === type);
      updatePreference.mutate({
        type,
        [field]: preference ? !preference[field] : true,
      });
    };

  const getPreference = (type: keyof typeof NOTIFICATION_TYPES) => {
    const preference = preferences.find(p => p.type === type);
    return {
      email: preference?.email ?? false,
      inApp: preference?.inApp ?? false,
    };
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography gutterBottom variant='h6'>
        Préférences de notifications
      </Typography>
      <TableContainer>
        <Table size='small' sx={{ '& td': { py: 1.5 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 2 }}>Type de notification</TableCell>
              <TableCell align='center' width={120}>
                Email
              </TableCell>
              <TableCell align='center' width={120}>
                Application
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => (
              <TableRow
                key={type}
                hover
                sx={{
                  '&:last-child td': {
                    border: 0,
                  },
                }}
              >
                <TableCell sx={{ pl: 2 }}>
                  <Typography sx={{ mb: 0.5 }} variant='subtitle2'>
                    {config.label}
                  </Typography>
                  <Typography
                    color='text.secondary'
                    sx={{ lineHeight: 1.3 }}
                    variant='body2'
                  >
                    {config.description}
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Switch
                    checked={
                      getPreference(type as keyof typeof NOTIFICATION_TYPES)
                        .email
                    }
                    disabled={
                      !canModifyPreference(type as NotificationType, 'email')
                    }
                    size='small'
                    onChange={() =>
                      handleToggle(type as keyof typeof NOTIFICATION_TYPES)(
                        'email'
                      )
                    }
                  />
                </TableCell>
                <TableCell align='center'>
                  <Switch
                    checked={
                      getPreference(type as keyof typeof NOTIFICATION_TYPES)
                        .inApp
                    }
                    disabled={
                      !canModifyPreference(type as NotificationType, 'inApp')
                    }
                    size='small'
                    onChange={() =>
                      handleToggle(type as keyof typeof NOTIFICATION_TYPES)(
                        'inApp'
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
