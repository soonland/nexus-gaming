import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
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

          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Flex>
      </Container>
    </Box>
  )
}
