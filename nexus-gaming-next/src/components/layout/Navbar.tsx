'use client'

import React from 'react'
import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
  Container,
  IconButton,
  useDisclosure,
  HStack,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react'
import { 
  HamburgerIcon, 
  CloseIcon, 
  MoonIcon, 
  SunIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { label: 'Games', href: '/games' },
  { label: 'Articles', href: '/articles' },
]

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onToggle } = useDisclosure()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  // Extract all color mode values
  const bgColor = useColorModeValue('white', 'gray.800')
  const hoverBgColor = useColorModeValue('gray.200', 'gray.700')
  const activeBgColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box bg={bgColor} px={4} shadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onToggle}
          />
          <HStack spacing={8} alignItems="center">
            <Box
              as={Link}
              href="/"
              fontWeight="bold"
              fontSize="xl"
              _hover={{ textDecoration: 'none' }}
            >
              Nexus Gaming
            </Box>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {NAV_ITEMS.map((item) => (
                <Box
                  key={item.label}
                  as={Link}
                  href={item.href}
                  px={2}
                  py={1}
                  rounded="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: hoverBgColor,
                  }}
                  bg={pathname === item.href ? activeBgColor : 'transparent'}
                >
                  {item.label}
                </Box>
              ))}
            </HStack>
          </HStack>
          <Stack direction="row" spacing={4} align="center">
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                >
                  {user.username}
                </MenuButton>
                <MenuList>
                  {user.role === 'ADMIN' && (
                    <MenuItem as="a" href="/admin">
                      Administration
                    </MenuItem>
                  )}
                  <MenuItem onClick={logout}>Se déconnecter</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button as="a" href="/login" colorScheme="blue">
                Se connecter
              </Button>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
