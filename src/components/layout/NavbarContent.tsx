import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MdDashboard } from 'react-icons/md';

import { NotificationBell } from '@/components/common/NotificationBell';
import { useAuth } from '@/hooks/useAuth';

import { AdminMenu } from './AdminMenu';
import { MobileMenu } from './MobileMenu';
import { UserAvatar } from './UserAvatar';

export const NavbarContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return <MobileMenu />;
  }

  return (
    <Stack
      alignItems='center'
      direction='row'
      justifyContent='space-between'
      spacing={2}
      sx={{
        px: 2,
        py: 1,
      }}
    >
      {/* Navigation principale */}
      <Stack direction='row' spacing={2}>
        <Button variant='text' onClick={() => router.push('/games')}>
          Jeux
        </Button>
        <Button variant='text' onClick={() => router.push('/articles')}>
          Articles
        </Button>
      </Stack>

      {/* Partie droite : auth ou menu utilisateur */}
      {user ? (
        <Stack alignItems='center' direction='row' spacing={2}>
          <Button
            startIcon={<MdDashboard />}
            variant='text'
            onClick={() => router.push('/admin/dashboard')}
          >
            Dashboard
          </Button>
          <AdminMenu />
          <NotificationBell />
          <UserAvatar />
        </Stack>
      ) : (
        <Button variant='text' onClick={() => router.push('/login')}>
          Se connecter
        </Button>
      )}
    </Stack>
  );
};
