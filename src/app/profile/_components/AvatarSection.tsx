import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FiCamera } from 'react-icons/fi';

import { useNotifier } from '@/components/common/Notifier';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateAvatar } from '@/hooks/useUpdateAvatar';

export const AvatarSection = () => {
  const { user } = useAuth();
  const updateAvatar = useUpdateAvatar();
  const { showSuccess, showError } = useNotifier();

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await updateAvatar.mutateAsync(file);
      showSuccess('Avatar mis à jour avec succès');
    } catch {
      showError("Erreur lors de la mise à jour de l'avatar");
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack alignItems='center' direction='row' spacing={2}>
          <Box position='relative'>
            <Avatar
              src={user?.avatarUrl || undefined}
              sx={{ width: 100, height: 100 }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: updateAvatar.isPending
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'transparent',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
              }}
            >
              {updateAvatar.isPending && (
                <CircularProgress size={32} sx={{ color: 'white' }} />
              )}
            </Box>
            <IconButton
              aria-label="Changer l'avatar"
              component='label'
              disabled={updateAvatar.isPending}
              sx={{
                'position': 'absolute',
                'right': -10,
                'bottom': -10,
                'bgcolor': 'background.paper',
                'boxShadow': 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
            >
              <input
                hidden
                accept='image/*'
                type='file'
                onChange={handleAvatarChange}
              />
              <FiCamera />
            </IconButton>
          </Box>
          <Stack spacing={1}>
            <Typography variant='h6'>{user?.username}</Typography>
            <Typography color='text.secondary' variant='body2'>
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
