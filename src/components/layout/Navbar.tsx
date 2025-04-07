'use client'

import React from 'react'
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
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@prisma/client'

export function Navbar() {
  const { user, logout } = useAuth()
  const { toggleColorMode, colorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const isAdmin = user?.role === Role.ADMIN

  return (
    <Box
      as="nav"
      py={4}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.xl">
        <HStack justify="space-between">
          {/* Navigation principale */}
          <HStack spacing={8}>
            <Button as={Link} href="/" variant="ghost">
              Accueil
            </Button>
            <Button as={Link} href="/articles" variant="ghost">
              Articles
            </Button>
            <Button as={Link} href="/games" variant="ghost">
              Jeux
            </Button>
          </HStack>

          {/* Menu de droite */}
          <HStack>
            {/* Menu admin */}
            {isAdmin && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMenu />}
                  variant="ghost"
                  aria-label="Menu d'administration"
                />
                <MenuList>
                  <MenuItem as={Link} href="/admin/articles">
                    Articles
                  </MenuItem>
                  <MenuItem as={Link} href="/admin/categories">
                    Catégories
                  </MenuItem>
                  <MenuItem as={Link} href="/admin/games">
                    Jeux
                  </MenuItem>
                  <MenuItem as={Link} href="/admin/platforms">
                    Plateformes
                  </MenuItem>
                  <MenuItem as={Link} href="/admin/companies">
                    Entreprises
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Bouton pour basculer le thème */}
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />

            {/* Boutons de connexion/déconnexion */}
            {user ? (
              <Button onClick={logout} variant="ghost">
                Déconnexion
              </Button>
            ) : (
              <Button as={Link} href="/login" variant="ghost">
                Connexion
              </Button>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
