import {
  Box,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  useTheme,
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
  FiMonitor,
  FiUsers,
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

import { useAuth } from '@/hooks/useAuth';
import { hasSufficientRole } from '@/lib/permissions';

const EDITOR = 'EDITOR' as Role;
const SENIOR_EDITOR = 'SENIOR_EDITOR' as Role;
const ADMIN = 'ADMIN' as Role;

export const AdminMenu = () => {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user || !hasSufficientRole(user.role, EDITOR)) {
    return null;
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleClose();
  };

  return (
    <Box component='span'>
      <Button
        startIcon={<MdDashboard />}
        variant='text'
        onClick={() => router.push('/admin/dashboard')}
      >
        Dashboard
      </Button>

      <Button
        sx={{
          'color': theme.palette.text.primary,
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
        variant='text'
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        Admin
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClick={handleClose}
        onClose={handleClose}
      >
        {/* SENIOR_EDITOR+ seulement */}
        {hasSufficientRole(user.role, SENIOR_EDITOR) && [
          <MenuItem
            key='announcements'
            onClick={() => handleNavigate('/admin/announcements')}
          >
            <ListItemIcon>
              <FiBell />
            </ListItemIcon>
            Annonces
          </MenuItem>,
          <MenuItem
            key='categories'
            onClick={() => handleNavigate('/admin/categories')}
          >
            <ListItemIcon>
              <FiFolder />
            </ListItemIcon>
            Catégories
          </MenuItem>,
        ]}

        {/* EDITOR+ */}
        <MenuItem onClick={() => handleNavigate('/admin/articles')}>
          <ListItemIcon>
            <FiFileText />
          </ListItemIcon>
          Articles
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/admin/games')}>
          <ListItemIcon>
            <FiGrid />
          </ListItemIcon>
          Jeux
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/admin/platforms')}>
          <ListItemIcon>
            <FiMonitor />
          </ListItemIcon>
          Plateformes
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/admin/companies')}>
          <ListItemIcon>
            <FiBox />
          </ListItemIcon>
          Entreprises
        </MenuItem>

        {/* ADMIN+ seulement */}
        {hasSufficientRole(user.role, ADMIN) && (
          <MenuItem onClick={() => handleNavigate('/admin/users')}>
            <ListItemIcon>
              <FiUsers />
            </ListItemIcon>
            Utilisateurs
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
