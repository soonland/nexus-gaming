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
  Text,
} from '@chakra-ui/react'
import { FiMenu, FiAlertTriangle } from 'react-icons/fi'
import { BiPowerOff, BiUser } from 'react-icons/bi'
import { usePasswordExpiration } from '@/hooks/usePasswordExpiration'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@prisma/client'
import { keyframes } from '@emotion/react'

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(0.95); opacity: 0.5; }
`

export function Navbar() {
  const { user, logout } = useAuth()
  const passwordExpiration = usePasswordExpiration()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const isAdmin = user && user.role !== Role.USER

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
                  <MenuItem as={Link} href="/admin/users">
                    Utilisateurs
                  </MenuItem>
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

            {/* Menu utilisateur ou bouton de connexion */}
            {user ? (
              <Menu>
                <MenuButton as={Button} variant="ghost" position="relative">
                  <HStack>
                    <Text>{user.username}</Text>
                    {(passwordExpiration?.isExpiringSoon || passwordExpiration?.isExpired) && (
                      <Box
                        position="relative"
                        color={passwordExpiration.isExpired ? "red.500" : "orange.500"}
                      >
                        <FiAlertTriangle size={18} />
                        <Box
                          position="absolute"
                          top="-1"
                          right="-1"
                          w="2"
                          h="2"
                          bg={passwordExpiration.isExpired ? "red.500" : "orange.500"}
                          borderRadius="full"
                          animation={`${pulseAnimation} 2s infinite`}
                        />
                      </Box>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} href="/profile" icon={<BiUser />}>
                    Mon profil
                    {(passwordExpiration?.isExpiringSoon || passwordExpiration?.isExpired) && (
                      <Text
                        as="span"
                        ml={2}
                        fontSize="sm"
                        color="orange.500"
                      >
                        {passwordExpiration.isExpired 
                          ? '(Mot de passe expiré)'
                          : `(Expire dans ${passwordExpiration.daysUntilExpiration}j)`
                        }
                      </Text>
                    )}
                  </MenuItem>
                  <MenuItem onClick={logout} color="red.500" icon={<BiPowerOff />}>
                    Déconnexion
                  </MenuItem>
                </MenuList>
              </Menu>
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
