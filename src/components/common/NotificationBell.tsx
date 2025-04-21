'use client';

import {
  Box,
  IconButton,
  Popover,
  Typography,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { FiBell } from 'react-icons/fi';

import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';

export const NotificationBell = () => {
  const passwordExpiration = usePasswordExpiration();
  const theme = useTheme();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const warningLevelConfig = {
    expired: {
      color: theme.palette.error.main,
      text: 'Votre mot de passe a expiré',
    },
    urgent: { color: theme.palette.error.main, text: 'Expiration imminente' },
    warning: { color: theme.palette.warning.main, text: 'Expiration approche' },
    info: {
      color: theme.palette.info.main,
      text: 'Pensez à changer votre mot de passe',
    },
    none: { color: undefined, text: undefined },
  };

  if (!passwordExpiration) {
    return null;
  }

  const hasNotifications = passwordExpiration.warningLevel !== 'none';

  return (
    <>
      <Box
        ref={anchorRef}
        sx={{ position: 'relative' }}
        onClick={e => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <IconButton aria-label='Notifications' sx={{ position: 'relative' }}>
          <FiBell size={20} />
        </IconButton>
        {hasNotifications && (
          <Box
            sx={{
              position: 'absolute',
              right: -1,
              top: -1,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor:
                warningLevelConfig[passwordExpiration.warningLevel].color,
              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
      </Box>
      <Popover
        PaperProps={{
          sx: {
            width: 300,
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
        {hasNotifications ? (
          <Stack spacing={2}>
            <Box>
              <Typography variant='subtitle2'>
                {warningLevelConfig[passwordExpiration.warningLevel].text}
              </Typography>
              <Typography color='text.secondary' variant='body2'>
                {passwordExpiration.daysUntilExpiration > 0
                  ? `Il vous reste ${passwordExpiration.daysUntilExpiration} jours pour changer votre mot de passe.`
                  : 'Pour votre sécurité, veuillez mettre à jour votre mot de passe immédiatement.'}
              </Typography>
            </Box>
            <Button
              color={
                passwordExpiration.warningLevel === 'expired' ||
                passwordExpiration.warningLevel === 'urgent'
                  ? 'error'
                  : passwordExpiration.warningLevel === 'warning'
                    ? 'warning'
                    : 'info'
              }
              component={Link}
              href='/profile#password-form'
              size='small'
              variant='contained'
            >
              Changer le mot de passe
            </Button>
          </Stack>
        ) : (
          <Typography color='text.secondary' variant='body2'>
            Aucune notification
          </Typography>
        )}
      </Popover>
    </>
  );
};
