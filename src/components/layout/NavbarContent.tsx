import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FiHome } from 'react-icons/fi';

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
        <Button
          startIcon={<FiHome size={20} />}
          variant='text'
          onClick={() => router.push('/')}
        >
          Accueil
        </Button>
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
