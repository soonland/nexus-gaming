import {
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
  Center,
  Box,
  Flex,
  FormLabel,
  CheckboxGroup,
  Checkbox,
  Wrap,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from './GameCard';
import { GameForm } from './GameForm';
import { Game, GameFormData } from '../../types/game';
import { usePlatforms } from '@/hooks/usePlatforms';

interface GameListProps {
  games?: Game[];
  isLoading?: boolean;
  onGameCreate?: (data: GameFormData) => Promise<void>;
}

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'date-desc', label: 'Plus récents' },
  { value: 'date-asc', label: 'Plus anciens' },
  { value: 'rating-desc', label: 'Meilleures notes' },
  { value: 'rating-asc', label: 'Notes les plus basses' },
];

export const GameList = ({
  games,
  isLoading = false,
  onGameCreate,
}: GameListProps) => {
  const navigate = useNavigate();
  const { isOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilters, setPlatformFilters] = useState<string[]>([]); 
  const [sortOption, setSortOption] = useState('title-asc');
  const [releaseYearFilter, setReleaseYearFilter] = useState('');
  const { platforms } = usePlatforms();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => (currentYear + 1 - i).toString()
  );

  const filteredAndSortedGames = useMemo(() => {
    const result = (games ?? []).filter((game) => {
      const matchesSearch = (game.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.publisher.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlatform = platformFilters.length === 0 ||
        game.platforms.some(platform => platformFilters.includes(platform.id));
      
      if (platformFilters.length > 0) {
        console.log(`\nFiltering game "${game.title}"`);
        console.log('- Game platforms:', JSON.stringify(game.platforms));
        console.log('- Current platform filters:', platformFilters);
        console.log('- Any matching platform?', matchesPlatform);
        if (!matchesPlatform) {
          console.log('  → Game filtered out: no matching platforms');
        }
      }

      const matchesYear = !releaseYearFilter || 
        (game.releaseDate && game.releaseDate.startsWith(releaseYearFilter));

      return matchesSearch && matchesPlatform && matchesYear;
    });

    // Sort the filtered results
    result.sort((a, b) => {
      switch (sortOption) {
        case 'title-asc':
          return (a.title ?? '').localeCompare(b.title ?? '');
        case 'title-desc':
          return (b.title ?? '').localeCompare(a.title ?? '');
        case 'date-desc':
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return b.releaseDate.localeCompare(a.releaseDate);
        case 'date-asc':
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return -1;
          if (!b.releaseDate) return 1;
          return a.releaseDate.localeCompare(b.releaseDate);
        case 'rating-desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'rating-asc':
          return (a.averageRating || 0) - (b.averageRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [games, searchTerm, platformFilters, sortOption, releaseYearFilter]);

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <Flex gap={4} wrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher un jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Flex gap={6} wrap="wrap" align="flex-start">
            <Box minW="200px" flex="1">
              <FormLabel>Plateformes</FormLabel>
              <Box 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor={borderColor}
                p={1}
              >
                <CheckboxGroup 
                  value={platformFilters} 
                  onChange={(value) => {
                    setPlatformFilters(value as string[]);
                  }}
                >
                  <Wrap>
                    {platforms?.map((platform) => (
                      <WrapItem key={platform.id}>
                        <Checkbox
                          value={platform.id}
                          sx={{
                            '& .chakra-checkbox__control': {
                              borderRadius: 'sm',
                            },
                            '& .chakra-checkbox__label': {
                              userSelect: 'none',
                            },
                            padding: '2px 8px',
                            borderRadius: 'md',
                            _hover: {
                              bg: hoverBg,
                            },
                          }}
                        >
                          <Text as="span" fontSize="sm">
                            {platform.name}
                          </Text>
                        </Checkbox>
                      </WrapItem>
                    ))}
                  </Wrap>
                </CheckboxGroup>
              </Box>
            </Box>

            <Box minW="200px">
              <FormLabel>Année de sortie</FormLabel>
              <Select
                value={releaseYearFilter}
                onChange={(e) => setReleaseYearFilter(e.target.value)}
                placeholder="Toutes les années"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </Box>

            <Box minW="200px">
              <FormLabel>Trier par</FormLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Stack>

        {isLoading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : (filteredAndSortedGames?.length ?? 0) > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredAndSortedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => navigate(`/games/${game.id}`)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={10}>
            <Text fontSize="lg" color="gray.500">
              Aucun jeu ne correspond à votre recherche
            </Text>
          </Center>
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un nouveau jeu</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <GameForm
              onSubmit={async (data) => {
                if (onGameCreate) {
                  await onGameCreate(data);
                  onClose();
                }
              }}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
