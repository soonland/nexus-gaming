'use client';

import {
  Avatar,
  Button,
  Stack,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import { BiPowerOff, BiUser } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

import { NotificationBell } from '@/components/common/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { canManageAnnouncements } from '@/lib/permissions';

export const NavbarContent = () => {
  const { user, logout } = useAuth();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const isAdmin = user && user.role !== Role.USER;
  const hasAnnouncementAccess = canManageAnnouncements(user?.role);

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: 2,
        py: 1,
      }}
    >
      {/* Navigation principale */}
      <Stack alignItems='center' direction='row' spacing={2}>
        <Button component={Link} href='/' variant='text'>
          Accueil
        </Button>
        <Button component={Link} href='/articles' variant='text'>
          Articles
        </Button>
        <Button component={Link} href='/games' variant='text'>
          Jeux
        </Button>
      </Stack>

      {/* Menu de droite */}
      <Stack alignItems='center' direction='row' spacing={2}>
        {/* Menu admin */}
        {isAdmin && (
          <>
            <Button
              component={Link}
              href='/admin'
              startIcon={<MdDashboard />}
              variant='text'
            >
              Dashboard
            </Button>
            <IconButton
              aria-label="Menu d'administration"
              onClick={e => setAdminMenuAnchor(e.currentTarget)}
            >
              <FiMenu />
            </IconButton>
            <Menu
              anchorEl={adminMenuAnchor}
              open={Boolean(adminMenuAnchor)}
              onClose={() => setAdminMenuAnchor(null)}
            >
              {hasAnnouncementAccess && (
                <MenuItem
                  component={Link}
                  href='/admin/announcements'
                  onClick={() => setAdminMenuAnchor(null)}
                >
                  Annonces
                </MenuItem>
              )}
              <MenuItem
                component={Link}
                href='/admin/users'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Utilisateurs
              </MenuItem>
              <MenuItem
                component={Link}
                href='/admin/articles'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Articles
              </MenuItem>
              <MenuItem
                component={Link}
                href='/admin/categories'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Catégories
              </MenuItem>
              <MenuItem
                component={Link}
                href='/admin/games'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Jeux
              </MenuItem>
              <MenuItem
                component={Link}
                href='/admin/platforms'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Plateformes
              </MenuItem>
              <MenuItem
                component={Link}
                href='/admin/companies'
                onClick={() => setAdminMenuAnchor(null)}
              >
                Entreprises
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Notifications */}
        {user && <NotificationBell />}

        {/* Menu utilisateur ou bouton de connexion */}
        {user ? (
          <>
            <Button
              startIcon={
                <Avatar
                  alt={user.username}
                  src={user.avatarUrl || undefined}
                  sx={{ width: 32, height: 32 }}
                />
              }
              variant='text'
              onClick={e => setUserMenuAnchor(e.currentTarget)}
            >
              {user.username}
            </Button>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={() => setUserMenuAnchor(null)}
            >
              <MenuItem
                component={Link}
                href='/profile'
                onClick={() => setUserMenuAnchor(null)}
              >
                <Box component={BiUser} sx={{ mr: 1 }} />
                Mon profil
              </MenuItem>
              <MenuItem
                sx={{ color: 'error.main' }}
                onClick={() => {
                  setUserMenuAnchor(null);
                  logout();
                }}
              >
                <Box component={BiPowerOff} sx={{ mr: 1 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button component={Link} href='/login' variant='text'>
            Connexion
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
