import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { FiAlertCircle, FiClock, FiXCircle } from 'react-icons/fi';

import { usePasswordExpiration } from '@/hooks/usePasswordExpiration';

export const PasswordExpiration = () => {
  const passwordExpiration = usePasswordExpiration();

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {passwordExpiration && passwordExpiration.warningLevel !== 'none' && (
        <Alert
          icon={
            passwordExpiration.warningLevel === 'expired' ? (
              <FiXCircle size={24} />
            ) : passwordExpiration.warningLevel === 'urgent' ? (
              <FiAlertCircle size={24} />
            ) : (
              <FiClock size={24} />
            )
          }
          severity={
            passwordExpiration.warningLevel === 'expired' ||
            passwordExpiration.warningLevel === 'urgent'
              ? 'error'
              : passwordExpiration.warningLevel === 'warning'
                ? 'warning'
                : 'info'
          }
          sx={{
            'borderRadius': 2,
            'border': '1px solid',
            'borderColor': theme =>
              passwordExpiration.warningLevel === 'expired' ||
              passwordExpiration.warningLevel === 'urgent'
                ? theme.palette.error.main
                : passwordExpiration.warningLevel === 'warning'
                  ? theme.palette.warning.main
                  : theme.palette.info.main,
            '& .MuiAlert-icon': {
              alignItems: 'center',
              marginRight: 2,
            },
          }}
        >
          <Box>
            <Typography
              component='div'
              fontWeight='medium'
              gutterBottom={false}
              variant='subtitle1'
            >
              {passwordExpiration.warningLevel === 'expired'
                ? 'Mot de passe expiré'
                : passwordExpiration.warningLevel === 'urgent'
                  ? 'Action requise immédiatement'
                  : passwordExpiration.warningLevel === 'warning'
                    ? 'Action requise bientôt'
                    : 'Information'}
            </Typography>
            <Typography color='text.secondary' variant='body2'>
              {passwordExpiration.warningLevel === 'expired'
                ? "Votre mot de passe a expiré. Veuillez le changer immédiatement pour maintenir l'accès à votre compte."
                : `Votre mot de passe expirera dans ${passwordExpiration.daysUntilExpiration} jour${
                    passwordExpiration.daysUntilExpiration > 1 ? 's' : ''
                  }. ${
                    passwordExpiration.warningLevel === 'urgent'
                      ? "Changez-le maintenant pour éviter les problèmes d'accès."
                      : passwordExpiration.warningLevel === 'warning'
                        ? 'Pensez à le changer bientôt.'
                        : ''
                  }`}
            </Typography>
            <Button
              color={
                passwordExpiration.warningLevel === 'expired' ||
                passwordExpiration.warningLevel === 'urgent'
                  ? 'error'
                  : passwordExpiration.warningLevel === 'warning'
                    ? 'warning'
                    : 'info'
              }
              size='small'
              sx={{ mt: 2 }}
              variant='outlined'
              onClick={() => {
                document.getElementById('password-form')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              Changer le mot de passe
            </Button>
          </Box>
        </Alert>
      )}
    </Stack>
  );
};
