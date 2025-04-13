'use client';

import {
  Box,
  Button,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { BiPowerOff, BiUser } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';

import { Avatar } from '@/components/common/Avatar';
import { NotificationBell } from '@/components/common/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { canManageAnnouncements } from '@/lib/permissions';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const isAdmin = user && user.role !== Role.USER;
  const hasAnnouncementAccess = canManageAnnouncements(user?.role);

  return (
    <Box
      as='nav'
      bg={bgColor}
      borderBottom='1px'
      borderColor={borderColor}
      position='sticky'
      py={4}
      top={0}
      zIndex={100}
    >
      <Container maxW='container.xl'>
        <HStack justify='space-between'>
          {/* Navigation principale */}
          <HStack spacing={8}>
            <Button as={Link} href='/' variant='ghost'>
              Accueil
            </Button>
            <Button as={Link} href='/articles' variant='ghost'>
              Articles
            </Button>
            <Button as={Link} href='/games' variant='ghost'>
              Jeux
            </Button>
          </HStack>

          {/* Menu de droite */}
          <HStack>
            {/* Menu admin */}
            {isAdmin && (
              <Menu>
                <MenuButton
                  aria-label="Menu d'administration"
                  as={IconButton}
                  icon={<FiMenu />}
                  variant='ghost'
                />
                <MenuList>
                  {hasAnnouncementAccess && (
                    <MenuItem as={Link} href='/admin/announcements'>
                      Annonces
                    </MenuItem>
                  )}
                  <MenuItem as={Link} href='/admin/users'>
                    Utilisateurs
                  </MenuItem>
                  <MenuItem as={Link} href='/admin/articles'>
                    Articles
                  </MenuItem>
                  <MenuItem as={Link} href='/admin/categories'>
                    Catégories
                  </MenuItem>
                  <MenuItem as={Link} href='/admin/games'>
                    Jeux
                  </MenuItem>
                  <MenuItem as={Link} href='/admin/platforms'>
                    Plateformes
                  </MenuItem>
                  <MenuItem as={Link} href='/admin/companies'>
                    Entreprises
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* Menu utilisateur ou bouton de connexion */}
            {user ? (
              <Menu>
                <MenuButton as={Button} px={2} variant='ghost'>
                  <HStack spacing={2}>
                    <Avatar
                      alt={user.username}
                      size='sm'
                      src={user.avatarUrl}
                    />
                    <Text>{user.username}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} href='/profile' icon={<BiUser />}>
                    Mon profil
                  </MenuItem>
                  <MenuItem
                    color='red.500'
                    icon={<BiPowerOff />}
                    onClick={logout}
                  >
                    Déconnexion
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button as={Link} href='/login' variant='ghost'>
                Connexion
              </Button>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
};
