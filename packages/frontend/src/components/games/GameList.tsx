import {
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Button,
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
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useState, useMemo } from 'react';
import { GameCard } from './GameCard';
import { GameForm } from './GameForm';
import { Game, GameFormData } from '../../types/game';

interface GameListProps {
  games?: Game[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onGameClick?: (game: Game) => void;
  onGameCreate?: (data: GameFormData) => Promise<void>;
}

const PLATFORM_OPTIONS = ['Toutes', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
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
  isAdmin = false,
  isLoading = false,
  onGameClick,
  onGameCreate,
}: GameListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('Toutes');
  const [sortOption, setSortOption] = useState('title-asc');
  const [releaseYearFilter, setReleaseYearFilter] = useState('');

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

      const matchesYear = !releaseYearFilter ||
        (game.releaseDate && new Date(game.releaseDate).getFullYear().toString() === releaseYearFilter) ||
        (game.releasePeriod && game.releasePeriod.value.startsWith(releaseYearFilter));

      return matchesSearch && matchesYear;
    });

    // Sort the filtered results
    result.sort((a, b) => {
      switch (sortOption) {
        case 'title-asc':
          return (a.title ?? '').localeCompare(b.title ?? '');
        case 'title-desc':
          return (b.title ?? '').localeCompare(a.title ?? '');
        case 'date-desc':
          return new Date(b.releaseDate || b.releasePeriod?.value || 0).getTime() -
                 new Date(a.releaseDate || a.releasePeriod?.value || 0).getTime();
        case 'date-asc':
          return new Date(a.releaseDate || a.releasePeriod?.value || 0).getTime() -
                 new Date(b.releaseDate || b.releasePeriod?.value || 0).getTime();
        case 'rating-desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'rating-asc':
          return (a.averageRating || 0) - (b.averageRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [games, searchTerm, platformFilter, sortOption, releaseYearFilter]);

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

            {isAdmin && onGameCreate && (
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                Ajouter un jeu
              </Button>
            )}
          </Flex>

          <Flex gap={4} wrap="wrap" align="flex-end">
            <Box minW="200px">
              <FormLabel>Plateforme</FormLabel>
              <Select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                {PLATFORM_OPTIONS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </Select>
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
                onClick={() => onGameClick?.(game)}
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
