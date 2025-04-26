import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FiBell,
  FiBox,
  FiFileText,
  FiFolder,
  FiGrid,
  FiHome,
  FiMenu,
  FiMonitor,
  FiUser,
  FiUsers,
} from 'react-icons/fi';

import { NotificationBell } from '@/components/common/NotificationBell';
import { UserAvatar } from '@/components/layout/UserAvatar';
import { useAuth } from '@/hooks/useAuth';
import { hasSufficientRole } from '@/lib/permissions';

const EDITOR = 'EDITOR' as Role;
const SENIOR_EDITOR = 'SENIOR_EDITOR' as Role;
const ADMIN = 'ADMIN' as Role;

export const MobileMenu = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsOpen(open);
    };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const publicNavigation = [
    { icon: <FiHome />, label: 'Accueil', path: '/' },
    { icon: <FiGrid />, label: 'Jeux', path: '/games' },
    { icon: <FiFileText />, label: 'Articles', path: '/articles' },
  ];

  const userNavigation = [
    ...publicNavigation,
    { icon: <FiUser />, label: 'Mon profil', path: '/profile' },
  ];

  const adminNavigation = [
    {
      icon: <FiFileText />,
      label: 'Gestion Articles',
      path: '/admin/articles',
    },
    { icon: <FiGrid />, label: 'Gestion Jeux', path: '/admin/games' },
    { icon: <FiMonitor />, label: 'Plateformes', path: '/admin/platforms' },
    { icon: <FiBox />, label: 'Entreprises', path: '/admin/companies' },
  ];

  const seniorEditorNavigation = [
    { icon: <FiBell />, label: 'Annonces', path: '/admin/announcements' },
    { icon: <FiFolder />, label: 'Catégories', path: '/admin/categories' },
  ];

  return (
    <Stack
      alignItems='center'
      direction='row'
      justifyContent='space-between'
      sx={{ width: '100%' }}
    >
      <IconButton color='inherit' edge='start' onClick={toggleDrawer(true)}>
        <FiMenu />
      </IconButton>

      {user && (
        <Stack direction='row' spacing={1}>
          <NotificationBell />
          <Box component='span'>
            <UserAvatar />
          </Box>
        </Stack>
      )}

      <Drawer
        PaperProps={{ sx: { width: 250 } }}
        anchor='left'
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          role='presentation'
          sx={{ width: 250 }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {user ? (
            <>
              {/* Navigation principale */}
              <List>
                {userNavigation.map(({ icon, label, path }) => (
                  <ListItem key={path}>
                    <ListItemButton onClick={() => handleNavigation(path)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* Section Admin */}
              {hasSufficientRole(user.role, EDITOR) && (
                <>
                  <Divider />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography color='text.secondary' variant='overline'>
                      Administration
                    </Typography>
                  </Box>

                  <List>
                    {/* Senior Editor menus */}
                    {hasSufficientRole(user.role, SENIOR_EDITOR) &&
                      seniorEditorNavigation.map(({ icon, label, path }) => (
                        <ListItem key={path}>
                          <ListItemButton
                            onClick={() => handleNavigation(path)}
                          >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                          </ListItemButton>
                        </ListItem>
                      ))}

                    {/* Editor menus */}
                    {adminNavigation.map(({ icon, label, path }) => (
                      <ListItem key={path}>
                        <ListItemButton onClick={() => handleNavigation(path)}>
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText primary={label} />
                        </ListItemButton>
                      </ListItem>
                    ))}

                    {/* Admin menus */}
                    {hasSufficientRole(user.role, ADMIN) && (
                      <ListItem>
                        <ListItemButton
                          onClick={() => handleNavigation('/admin/users')}
                        >
                          <ListItemIcon>
                            <FiUsers />
                          </ListItemIcon>
                          <ListItemText primary='Utilisateurs' />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </List>
                </>
              )}
            </>
          ) : (
            <>
              {/* Navigation publique */}
              <List>
                {publicNavigation.map(({ icon, label, path }) => (
                  <ListItem key={path}>
                    <ListItemButton onClick={() => handleNavigation(path)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <Stack spacing={2} sx={{ p: 2 }}>
                <Button
                  variant='text'
                  onClick={() => handleNavigation('/login')}
                >
                  Se connecter
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Drawer>
    </Stack>
  );
};
