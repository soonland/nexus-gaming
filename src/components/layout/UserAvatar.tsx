import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export const UserAvatar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  if (!user) return null;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Mon compte'>
          <IconButton
            aria-controls={anchorEl ? 'account-menu' : undefined}
            aria-expanded={anchorEl ? 'true' : undefined}
            aria-haspopup='true'
            size='small'
            sx={{ ml: 2 }}
            onClick={handleOpen}
          >
            <Avatar
              alt={user.username}
              src={user.avatarUrl || undefined}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id='account-menu'
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              'overflow': 'visible',
              'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              'mt': 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClick={handleClose}
        onClose={handleClose}
      >
        <Stack sx={{ px: 2, py: 1 }}>
          <Typography variant='subtitle2'>{user.username}</Typography>
          <Typography color='text.secondary' variant='body2'>
            {user.email}
          </Typography>
        </Stack>
        <Divider />
        <MenuItem onClick={handleProfile}>Mon profil</MenuItem>
        <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
      </Menu>
    </>
  );
};
