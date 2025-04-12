'use client'

import {
  Box,
  Stack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Checkbox,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { GameData } from '@/types'

interface GameSelectorListProps {
  games?: Array<Pick<GameData, 'id' | 'title'> & { platforms?: Array<{ name: string }> }>
  selectedGames: string[]
  onGameSelect: (gameId: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function GameSelectorList({
  games = [],
  selectedGames,
  onGameSelect,
  searchTerm,
  onSearchChange,
}: GameSelectorListProps) {
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Stack spacing={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Rechercher un jeu..."
          size="md"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      <Box
        maxH="400px"
        overflowY="auto"
        borderWidth="1px"
        borderRadius="md"
      >
        <Stack spacing={0}>
          {games.map((game) => (
            <Box
              key={game.id}
              p={2}
              cursor="pointer"
              onClick={() => game.id && onGameSelect(game.id)}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              <HStack>
                <Checkbox
                  isChecked={game.id ? selectedGames.includes(game.id) : false}
                  onChange={() => {}}
                  pointerEvents="none"
                />
                <Box flex="1">
                  <Text fontWeight="medium">{game.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {game.platforms?.map((p) => p.name).join(', ')}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
