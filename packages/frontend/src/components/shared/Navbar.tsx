import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useAuth } from '@/providers/AuthProvider'

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, logout, loading } = useAuth()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Box as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
              Nexus Gaming
            </Box>
            <HStack as="nav" spacing={4}>
              <Button as={RouterLink} to="/" variant="ghost">
                Jeux
              </Button>
              <Button as={RouterLink} to="/articles" variant="ghost">
                Articles
              </Button>
            </HStack>
          </HStack>

          <HStack spacing={4}>
            {!loading && (
              user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        colorScheme="purple"
                        size="sm"
                      >
                        Administration
                      </MenuButton>
                      <MenuList>
                        <MenuItem as={RouterLink} to="/admin/games">
                          Liste des jeux
                        </MenuItem>
                        <MenuItem as={RouterLink} to="/admin/games/new">
                          Créer un jeu
                        </MenuItem>
                        <MenuItem as={RouterLink} to="/admin/platforms">
                          Plateformes
                        </MenuItem>
                        <MenuItem as={RouterLink} to="/admin/platforms/new">
                          Créer une plateforme
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      colorScheme="blue"
                      size="sm"
                    >
                      {user.username}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={logout}>
                        Se déconnecter
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                >
                  Se connecter
                </Button>
              )
            )}
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
