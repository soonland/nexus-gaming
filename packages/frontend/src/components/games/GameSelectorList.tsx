import {
  Box,
  Checkbox,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useMemo, useState } from 'react';
import { Game } from '../../types/game';

interface GameSelectorListProps {
  games?: Game[];
  selectedGames: string[];
  onGameSelect: (gameId: string) => void;
}

export const GameSelectorList = ({ games = [], selectedGames, onGameSelect }: GameSelectorListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      (game.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platforms.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [games, searchTerm]);

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Box
        maxH="400px"
        overflowY="auto"
        borderWidth="1px"
        borderRadius="md"
      >
        <Stack spacing={0}>
          {filteredGames.map((game) => (
            <Box
              key={game.id}
              p={2}
              cursor="pointer"
              onClick={() => onGameSelect(game.id)}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              <HStack>
                <Checkbox
                  isChecked={selectedGames.includes(game.id)}
                  onChange={() => {}}
                  pointerEvents="none"
                />
                <Box flex="1">
                  <Text fontWeight="medium">{game.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {game.platforms.map(p => p.name).join(', ')}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
